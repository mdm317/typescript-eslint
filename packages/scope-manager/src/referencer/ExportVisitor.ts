import type { TSESTree } from '@typescript-eslint/types';

import { AST_NODE_TYPES } from '@typescript-eslint/types';

import type { Referencer } from './Referencer';

import { Visitor } from './Visitor';

export type ExportNode =
  | TSESTree.ExportAllDeclaration
  | TSESTree.ExportDefaultDeclaration
  | TSESTree.ExportNamedDeclaration;

export class ExportVisitor extends Visitor {
  readonly #exportNode: ExportNode;
  readonly #referencer: Referencer;

  constructor(node: ExportNode, referencer: Referencer) {
    super(referencer);
    this.#exportNode = node;
    this.#referencer = referencer;
  }

  static visit(referencer: Referencer, node: ExportNode): void {
    const exportReferencer = new ExportVisitor(node, referencer);
    exportReferencer.visit(node);
  }

  protected ExportDefaultDeclaration(
    node: TSESTree.ExportDefaultDeclaration,
  ): void {
    if (node.declaration.type === AST_NODE_TYPES.Identifier) {
      // export default A;
      // this could be a type or a variable
      this.visit(node.declaration);
    } else {
      // export const a = 1;
      // export something();
      // etc
      // these not included in the scope of this visitor as they are all guaranteed to be values or declare variables
    }
  }

  protected ExportNamedDeclaration(
    node: TSESTree.ExportNamedDeclaration,
  ): void {
    if (node.source) {
      // export ... from 'foo';
      // these are external identifiers so there shouldn't be references or defs
      return;
    }

    if (!node.declaration) {
      // export { x };
      this.visitChildren(node);
    } else {
      // export const x = 1;
      // this is not included in the scope of this visitor as it creates a variable
    }
  }

  protected ExportSpecifier(node: TSESTree.ExportSpecifier): void {
    if (
      node.exportKind === 'type' &&
      node.local.type === AST_NODE_TYPES.Identifier
    ) {
      // export { type T };
      // type exports can only reference types
      //
      // we can't let this fall through to the Identifier selector because the exportKind is on this node
      // and we don't have access to the `.parent` during scope analysis
      this.#referencer.currentScope().referenceType(node.local);
    } else {
      this.visit(node.local);
    }
  }

  protected Identifier(node: TSESTree.Identifier): void {
    if (this.#exportNode.exportKind === 'type') {
      // export type { T };
      // type exports can only reference types
      this.#referencer.currentScope().referenceType(node);
    } else {
      this.#referencer.currentScope().referenceDualValueType(node);
    }
  }
}
