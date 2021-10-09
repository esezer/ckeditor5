import Command from "@ckeditor/ckeditor5-core/src/command";

export default class MshapeCommand extends Command {
  execute({ value }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change((writer) => {
      // Create a <mshape> element with the "name" attribute (and all the selection attributes)...
      const mshape = writer.createElement("mshape", {
        ...Object.fromEntries(selection.getAttributes()),
        name: value,
      });

      // ... and insert it into the document.
      editor.model.insertContent(mshape);

      // Put the selection on the inserted element.
      writer.setSelection(mshape, "on");
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;

    const isAllowed = model.schema.checkChild(selection.focus.parent, "mshape");

    this.isEnabled = isAllowed;
  }
}
