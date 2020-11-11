import * as Utilities from "./utilities";
import * as Color from "./color";
import * as Menu from "./menu";
import * as SaveLoad from "./save_load";
import * as Paint from "./paint";

window.onload = function () {
    var savedCanvas = Utilities.getObject("saved_canvas");

    if (savedCanvas !== true) {
        savedCanvas = false;
    }

    Color.init(SaveLoad.getRgb());
    Menu.init();
    Paint.init(savedCanvas);
};

window.onunload = function () {
    SaveLoad.save();
};
