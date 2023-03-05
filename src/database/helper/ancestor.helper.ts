import { Model } from 'mongoose';

export class AncestorsHelper {
  static buildAncestors(parent) {
    if (parent) {
      const parentAncestors = parent.ancestors || [];
      const newAncestor = {
        _id: parent._id,
        name: parent.name,
      };
      return [newAncestor].concat(parentAncestors);
    }
    return [];
  }

  static async getSubGraphByParentId(model: Model, id) {
    const nodes = await model.find({ 'ancestors._id': id }, 'parentId name ancestors').exec() || [];
    const nodesByParent = new Map();
    nodes.forEach((node) => {
      nodesByParent.set(node.parentId.toString(), (nodesByParent.get(node.parentId.toString()) || []).concat(node));
    });
    return nodesByParent;
  }

  static async updateNodeAndDescendants(model: Model, nodesByParent, node, parent) {
    const ancestors = AncestorsHelper.buildAncestors(parent);
    node.ancestors = ancestors;
    await model.findByIdAndUpdate(node._id, { ancestors });
    (nodesByParent.get(node._id.toString()) || []).forEach((child) => {
      AncestorsHelper.updateNodeAndDescendants(model, nodesByParent, child, node);
    });
  }
}
