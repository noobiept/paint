import { getObject } from "@drk4/utilities";
import * as Color from "./color";
import * as Menu from "./menu";
import * as SaveLoad from "./save_load";
import * as Paint from "./paint";
import * as Settings from "./settings";

window.onload = function () {
    let savedCanvas = getObject("saved_canvas");

    if (savedCanvas !== true) {
        savedCanvas = false;
    }

    Color.init(SaveLoad.getRgb());
    Menu.init();
    Paint.init(savedCanvas);
    Settings.init();
};

window.onunload = function () {
    SaveLoad.save();
};
