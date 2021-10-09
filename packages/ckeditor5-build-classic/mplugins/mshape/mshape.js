import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import MshapeEditing from "./mshapeediting";
import MshapeUI from "./mshapeui";

export default class Mshape extends Plugin {
  static get requires() {
    return [MshapeEditing, MshapeUI];
  }
}
