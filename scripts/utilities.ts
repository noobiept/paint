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

export enum MouseButton {
    left = 0,
    middle = 1,
    right = 2,
    back = 3,
    forward = 4,
}

export enum KeyCode {
    one = 49,
    two = 50,
    three = 51,
    four = 52,
    five = 53,
    graveAccent = 192, // ` character
}
