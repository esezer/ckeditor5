import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";

import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import MshapeCommand from "./mshapecommand";
import "./ckeditor5-test/theme/mshape.css";

export default class MshapeEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();
    this.editor.commands.add("mshape", new MshapeCommand(this.editor));

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) =>
        viewElement.hasClass("mshape")
      )
    );

    this.editor.config.define("mshapeConfig", {
      types: [
        "🔴",
        "🟠",
        "🟡",
        "🟢",
        "🔵",
        "🟣",
        "🟤",
        "⚫",
        "⚪",
        "🟥",
        "🟧",
        "🟨",
        "🟩",
        "🟦",
        "🟪",
        "🟫",
        "⬛",
        "⬜",
        "◼",
        "◻",
        "◾",
        "◽",
        "🔶",
        "🔷",
        "🔸",
        "🔹",
        "▲",
        "△",
        "🔺",
        "🔻",
        "🔘",
        "🔳",
        "🔲",
        "♠",
        "♥",
        "♦",
        "♣",
      ],
    });
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("mshape", {
      // Allow wherever text is allowed:
      allowWhere: "$text",
      // The mshape will act as an inline node:
      isInline: true,
      // The inline widget is self-contained so it cannot be split by the caret and can be selected:
      isObject: true,
      // The inline widget can have the same attributes as text (for example linkHref, bold).
      allowAttributesOf: "$text",
      // The mshape can have many types, like date, name, surname, etc:
      allowAttributes: ["name"],
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: ["mshape"],
      },
      model: (viewElement, { writer: modelWriter }) => {
        // Extract the "name" from "{name}".
        const name = viewElement.getChild(0).data;

        return modelWriter.createElement("mshape", { name });
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "mshape",
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createMshapeView(modelItem, viewWriter);

        // Enable widget handling on a mshape element inside the editing view.
        return toWidget(widgetElement, viewWriter);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "mshape",
      view: (modelItem, { writer: viewWriter }) =>
        createMshapeView(modelItem, viewWriter),
    });

    // Helper method for both downcast converters.
    function createMshapeView(modelItem, viewWriter) {
      const name = modelItem.getAttribute("name");

      const mshapeView = viewWriter.createContainerElement(
        "span",
        {
          class: "mshape",
        },
        {
          isAllowedInsideAttributeElement: true,
        }
      );

      // Insert the mshape name (as a text).
      const innerText = viewWriter.createText("" + name + "");
      viewWriter.insert(viewWriter.createPositionAt(mshapeView, 0), innerText);

      return mshapeView;
    }
  }
}
