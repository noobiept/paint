export function toCssColor(
    red: number,
    green: number,
    blue: number,
    alpha?: number
) {
    if (typeof alpha == "undefined") {
        alpha = 1;
    }

    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
}
