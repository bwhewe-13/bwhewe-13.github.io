document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card[data-repo]');
  const updatedLabel = document.getElementById('projects-updated');
  const activitySection = document.querySelector('.github-activity[data-user]');
  const activityList = document.getElementById('activity-list');
  const activityUpdatedLabel = document.getElementById('activity-updated');
  const activityUser = activitySection ? activitySection.getAttribute('data-user') : null;

  const cacheKey = 'githubRepoStats.v1';
  const cacheTtlMs = 7 * 24 * 60 * 60 * 1000;
  const activityCacheKey = 'githubActivity.v1';
  const activityCacheTtlMs = 60 * 60 * 1000;

  const repoList = Array.from(projectCards)
    .map((card) => card.getAttribute('data-repo'))
    .filter(Boolean);

  const uniqueRepos = Array.from(new Set(repoList));

  function updateCard(card, data) {
    const starsValue = card.querySelector('.project-stat[data-stat="stars"] .stat-value');
    const forksValue = card.querySelector('.project-stat[data-stat="forks"] .stat-value');

    if (starsValue) {
      starsValue.textContent = String(data.stargazers_count ?? '--');
    }

    if (forksValue) {
      forksValue.textContent = String(data.forks_count ?? '--');
    }
  }

  function updateCardError(card) {
    const values = card.querySelectorAll('.project-stat .stat-value');
    values.forEach((value) => {
      value.textContent = '--';
    });
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) {
      return 'Unavailable';
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return 'Unavailable';
    }

    const diffMs = date.getTime() - Date.now();
    const diffSeconds = Math.round(diffMs / 1000);

    const ranges = [
      { unit: 'year', seconds: 60 * 60 * 24 * 365 },
      { unit: 'month', seconds: 60 * 60 * 24 * 30 },
      { unit: 'week', seconds: 60 * 60 * 24 * 7 },
      { unit: 'day', seconds: 60 * 60 * 24 },
      { unit: 'hour', seconds: 60 * 60 },
      { unit: 'minute', seconds: 60 }
    ];

    const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    for (const range of ranges) {
      if (Math.abs(diffSeconds) >= range.seconds) {
        const value = Math.round(diffSeconds / range.seconds);
        return formatter.format(value, range.unit);
      }
    }

    return formatter.format(diffSeconds, 'second');
  }

  function setLastUpdated(timestamp, isStale) {
    if (!updatedLabel) {
      return;
    }

    const label = formatRelativeTime(timestamp);
    updatedLabel.textContent = `Last updated: ${label}${isStale ? ' (refreshing)' : ''}`;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      return;
    }
  }

  function applyCachedData(cacheData) {
    projectCards.forEach((card) => {
      const repo = card.getAttribute('data-repo');
      if (!repo) {
        updateCardError(card);
        return;
      }

      const data = cacheData[repo];
      if (data) {
        updateCard(card, data);
      } else {
        updateCardError(card);
      }
    });
  }

  function setActivityUpdated(timestamp, isStale) {
    if (!activityUpdatedLabel) {
      return;
    }

    const label = formatRelativeTime(timestamp);
    activityUpdatedLabel.textContent = `Last updated: ${label}${isStale ? ' (refreshing)' : ''}`;
  }

  function readActivityCache() {
    try {
      const raw = localStorage.getItem(activityCacheKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function writeActivityCache(data) {
    try {
      localStorage.setItem(activityCacheKey, JSON.stringify(data));
    } catch (error) {
      return;
    }
  }

  function clearActivityList() {
    if (!activityList) {
      return;
    }
    activityList.innerHTML = '';
  }

  function getBranchName(ref) {
    if (!ref) {
      return '';
    }
    const parts = ref.split('/');
    return parts[parts.length - 1] || '';
  }

  function describeActivity(event) {
    const repoName = event?.repo?.name || '';
    const repoUrl = repoName ? `https://github.com/${repoName}` : '';
    const payload = event?.payload || {};
    const action = payload.action ? String(payload.action) : '';
    const actionLabel = action ? `${action.charAt(0).toUpperCase()}${action.slice(1)}` : '';

    switch (event?.type) {
      case 'PushEvent': {
        const count = Array.isArray(payload.commits) ? payload.commits.length : 0;
        const branch = getBranchName(payload.ref);
        return {
          icon: 'fa-solid fa-code-commit',
          leading: `Pushed ${count || 1} commit${count === 1 ? '' : 's'} to `,
          repoName,
          repoUrl,
          trailing: '',
          meta: branch ? `branch ${branch}` : ''
        };
      }
      case 'IssuesEvent':
        return {
          icon: 'fa-regular fa-circle-dot',
          leading: `${actionLabel || 'Updated'} issue in `,
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.issue?.title ? `issue: ${payload.issue.title}` : ''
        };
      case 'IssueCommentEvent':
        return {
          icon: 'fa-regular fa-comment-dots',
          leading: `${actionLabel || 'Commented on'} issue in `,
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.issue?.title ? `issue: ${payload.issue.title}` : ''
        };
      case 'PullRequestEvent':
        return {
          icon: 'fa-solid fa-code-pull-request',
          leading: `${actionLabel || 'Updated'} pull request in `,
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.pull_request?.title ? `PR: ${payload.pull_request.title}` : ''
        };
      case 'PullRequestReviewEvent':
        return {
          icon: 'fa-solid fa-code-pull-request',
          leading: 'Reviewed pull request in ',
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.pull_request?.title ? `PR: ${payload.pull_request.title}` : ''
        };
      case 'CreateEvent':
        return {
          icon: 'fa-solid fa-plus',
          leading: `Created ${payload.ref_type || 'item'} in `,
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.ref ? `${payload.ref_type || 'item'}: ${payload.ref}` : ''
        };
      case 'DeleteEvent':
        return {
          icon: 'fa-solid fa-trash',
          leading: `Deleted ${payload.ref_type || 'item'} in `,
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.ref ? `${payload.ref_type || 'item'}: ${payload.ref}` : ''
        };
      case 'ReleaseEvent':
        return {
          icon: 'fa-solid fa-tag',
          leading: 'Published a release in ',
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.release?.name || payload.release?.tag_name ? `release: ${payload.release?.name || payload.release?.tag_name}` : ''
        };
      case 'ForkEvent':
        return {
          icon: 'fa-solid fa-code-fork',
          leading: 'Forked ',
          repoName,
          repoUrl,
          trailing: '',
          meta: payload.forkee?.full_name ? `to ${payload.forkee.full_name}` : ''
        };
      case 'WatchEvent':
        return {
          icon: 'fa-regular fa-star',
          leading: 'Starred ',
          repoName,
          repoUrl,
          trailing: '',
          meta: ''
        };
      case 'PublicEvent':
        return {
          icon: 'fa-solid fa-unlock',
          leading: 'Open sourced ',
          repoName,
          repoUrl,
          trailing: '',
          meta: ''
        };
      default:
        return {
          icon: 'fa-regular fa-circle',
          leading: 'Updated ',
          repoName,
          repoUrl,
          trailing: '',
          meta: ''
        };
    }
  }

  function buildActivitySummary(summary, descriptor) {
    summary.textContent = '';
    summary.append(document.createTextNode(descriptor.leading));

    if (descriptor.repoUrl && descriptor.repoName) {
      const link = document.createElement('a');
      link.href = descriptor.repoUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = descriptor.repoName;
      summary.append(link);
    } else if (descriptor.repoName) {
      summary.append(document.createTextNode(descriptor.repoName));
    }

    if (descriptor.trailing) {
      summary.append(document.createTextNode(descriptor.trailing));
    }
  }

  function renderActivity(events) {
    if (!activityList) {
      return;
    }

    clearActivityList();

    if (!events || events.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'activity-empty';
      empty.textContent = 'No recent public activity.';
      activityList.append(empty);
      return;
    }

    events.forEach((event) => {
      const descriptor = describeActivity(event);
      const item = document.createElement('div');
      item.className = 'activity-item';

      const iconWrap = document.createElement('span');
      iconWrap.className = 'activity-icon';
      const icon = document.createElement('i');
      icon.className = descriptor.icon;
      iconWrap.append(icon);

      const content = document.createElement('div');
      content.className = 'activity-content';

      const header = document.createElement('div');
      header.className = 'activity-header';

      const summary = document.createElement('span');
      summary.className = 'activity-summary';
      buildActivitySummary(summary, descriptor);

      const time = document.createElement('span');
      time.className = 'activity-time';
      time.textContent = formatRelativeTime(event.created_at);

      header.append(summary, time);
      content.append(header);

      if (descriptor.meta) {
        const meta = document.createElement('div');
        meta.className = 'activity-meta';
        meta.textContent = descriptor.meta;
        content.append(meta);
      }

      item.append(iconWrap, content);
      activityList.append(item);
    });
  }

  if (projectCards.length > 0) {
    const cached = readCache();
    if (cached && cached.timestamp && cached.data) {
      const ageMs = Date.now() - cached.timestamp;
      setLastUpdated(cached.timestamp, ageMs >= cacheTtlMs);
      if (ageMs < cacheTtlMs) {
        applyCachedData(cached.data);
      }
    }

    const shouldFetchRepos = !cached || !cached.timestamp || Date.now() - cached.timestamp >= cacheTtlMs;

    if (shouldFetchRepos && uniqueRepos.length > 0) {
      Promise.all(
        uniqueRepos.map((repo) =>
          fetch(`https://api.github.com/repos/${repo}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${repo}`);
              }
              return response.json();
            })
            .then((data) => ({ repo, data }))
            .catch(() => ({ repo, data: null }))
        )
      ).then((results) => {
        const dataMap = {};
        let hasData = false;

        results.forEach(({ repo, data }) => {
          if (data) {
            hasData = true;
            dataMap[repo] = data;
          }

          projectCards.forEach((card) => {
            if (card.getAttribute('data-repo') !== repo) {
              return;
            }

            if (data) {
              updateCard(card, data);
            } else {
              updateCardError(card);
            }
          });
        });

        writeCache({
          timestamp: Date.now(),
          data: dataMap
        });

        if (hasData) {
          setLastUpdated(Date.now(), false);
        } else if (!cached || !cached.timestamp) {
          setLastUpdated(null, false);
        }
      });
    }
  }

  if (activityUser && activityList) {
    const cachedActivity = readActivityCache();
    if (cachedActivity && cachedActivity.timestamp && cachedActivity.data) {
      const ageMs = Date.now() - cachedActivity.timestamp;
      setActivityUpdated(cachedActivity.timestamp, ageMs >= activityCacheTtlMs);
      renderActivity(cachedActivity.data);
    }

    const shouldFetchActivity =
      !cachedActivity ||
      !cachedActivity.timestamp ||
      Date.now() - cachedActivity.timestamp >= activityCacheTtlMs;

    if (shouldFetchActivity) {
      fetch(`https://api.github.com/users/${activityUser}/events/public?per_page=8`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch activity');
          }
          return response.json();
        })
        .then((events) => {
          const safeEvents = Array.isArray(events) ? events.slice(0, 8) : [];
          renderActivity(safeEvents);
          writeActivityCache({
            timestamp: Date.now(),
            data: safeEvents
          });
          setActivityUpdated(Date.now(), false);
        })
        .catch(() => {
          if (!cachedActivity || !cachedActivity.timestamp) {
            renderActivity([]);
            setActivityUpdated(null, false);
          }
        });
    }
  }
});
