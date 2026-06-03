import os
from glob import glob

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

path = "tmp-sort-dump/"

os.makedirs(path, exist_ok=True)


def bubble_sort(arr, return_snapshots=False):
    snapshots = [arr.copy()] if return_snapshots else None
    n = len(arr)
    for ii in range(n - 1):
        for jj in range(n - ii - 1):
            if arr[jj] > arr[jj + 1]:
                arr[jj], arr[jj + 1] = arr[jj + 1], arr[jj]
        if return_snapshots:
            snapshots.append(arr.copy())
    if return_snapshots:
        return arr, snapshots
    return arr


def selection_sort(arr, return_snapshots=False):
    snapshots = [arr.copy()] if return_snapshots else None
    n = len(arr)
    for ii in range(n - 1):
        min_idx = ii
        for jj in range(ii + 1, n):
            if arr[jj] < arr[min_idx]:
                min_idx = jj
        arr[ii], arr[min_idx] = arr[min_idx], arr[ii]
        if return_snapshots:
            snapshots.append(arr.copy())
    if return_snapshots:
        return arr, snapshots
    return arr


def insertion_sort(arr, return_snapshots=False):
    snapshots = [arr.copy()] if return_snapshots else None
    n = len(arr)
    for ii in range(n):
        idx = ii
        val = arr[ii]
        for jj in range(ii - 1, -1, -1):
            if arr[jj] > val:
                arr[jj + 1] = arr[jj]
                idx = jj
            else:
                break
        arr[idx] = val
        if return_snapshots:
            snapshots.append(arr.copy())
    if return_snapshots:
        return arr, snapshots
    return arr


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result


def merge_sort(arr, return_snapshots=False):
    snapshots = [arr.copy()] if return_snapshots else None
    step = 1
    length = len(arr)

    while step < length:
        for i in range(0, length, 2 * step):
            left = arr[i : i + step]
            right = arr[i + step : i + 2 * step]

            merged = merge(left, right)

            for j, val in enumerate(merged):
                arr[i + j] = val
        if return_snapshots:
            snapshots.append(arr.copy())
        step *= 2

    if return_snapshots:
        return arr, snapshots
    return arr


xdim = 100
n_arrs = 10

arrs = np.array([np.random.permutation(xdim) for _ in range(n_arrs)])

merge_sort_snapshots = []
bubble_sort_snapshots = []
selection_sort_snapshots = []
insertion_sort_snapshots = []
for n in range(n_arrs):
    arr = arrs[n]
    _, snapshots = merge_sort(arr.copy(), return_snapshots=True)
    merge_sort_snapshots.append(snapshots)
    _, snapshots = bubble_sort(arr.copy(), return_snapshots=True)
    bubble_sort_snapshots.append(snapshots)
    _, snapshots = selection_sort(arr.copy(), return_snapshots=True)
    selection_sort_snapshots.append(snapshots)
    _, snapshots = insertion_sort(arr.copy(), return_snapshots=True)
    insertion_sort_snapshots.append(snapshots)


max_merge_sorts = max([len(ii) for ii in merge_sort_snapshots])
max_bubble_sorts = max([len(ii) for ii in bubble_sort_snapshots])
max_selection_sorts = max([len(ii) for ii in selection_sort_snapshots])
max_insertion_sorts = max([len(ii) for ii in insertion_sort_snapshots])

timesteps = [
    max_merge_sorts,
    max_bubble_sorts,
    max_selection_sorts,
    max_insertion_sorts,
]

max_steps = max(timesteps)

for step in range(max_steps):
    merge_step = np.array(
        [
            merge_sort_snapshots[ii][min(step, max_merge_sorts - 1)]
            for ii in range(n_arrs)
        ]
    )
    bubble_step = np.array(
        [
            bubble_sort_snapshots[ii][min(step, max_bubble_sorts - 1)]
            for ii in range(n_arrs)
        ]
    )
    selection_step = np.array(
        [
            selection_sort_snapshots[ii][min(step, max_selection_sorts - 1)]
            for ii in range(n_arrs)
        ]
    )
    insertion_step = np.array(
        [
            insertion_sort_snapshots[ii][min(step, max_insertion_sorts - 1)]
            for ii in range(n_arrs)
        ]
    )

    fig, ax = plt.subplots(1, 4, figsize=(5.5, 8))
    ax[0].pcolormesh(merge_step.T, cmap="gist_rainbow")
    ax[0].set_title("Merge Sort", fontsize=10)
    ax[1].pcolormesh(bubble_step.T, cmap="gist_rainbow")
    ax[1].set_title("Bubble Sort", fontsize=10)
    ax[2].pcolormesh(selection_step.T, cmap="gist_rainbow")
    ax[2].set_title("Selection Sort", fontsize=10)
    ax[3].pcolormesh(insertion_step.T, cmap="gist_rainbow")
    ax[3].set_title("Insertion Sort", fontsize=10)

    for ii in range(4):
        ax[ii].set_aspect("equal", adjustable="box")
        ax[ii].xaxis.set_visible(False)
        ax[ii].yaxis.set_visible(False)
        ax[ii].spines["top"].set_visible(True)
        ax[ii].spines["right"].set_visible(True)
        ax[ii].spines["bottom"].set_visible(True)
        ax[ii].spines["left"].set_visible(True)

    fstep = str(step).zfill(3)
    fig.savefig(f"{path}step-{fstep}.png", bbox_inches="tight", dpi=300)

    plt.close()


files = np.sort(glob(path + "step-*.png"))
frames = [Image.open(image) for image in files]
frame_one = frames[0]
frame_one.save(
    path + "sorting.gif",
    format="GIF",
    append_images=frames,
    save_all=True,
    duration=200,
    loop=0,
)
