export function getColumnSize(col) {
    const colTop = col.offsetTop;
    const colLeft = col.offsetLeft;
    const colHeight = col.offsetHeight;
    const colWidth = col.offsetWidth;
    return {
        top: colTop,
        left: colLeft,
        width: colWidth,
        height: colHeight,
    }
}