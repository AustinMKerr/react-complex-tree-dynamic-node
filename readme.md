# React Complex Tree

![Demo for React Complex Tree](http://i.imgur.com/KQ90KEs.gif)

> An Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop

Look into the [official documentation](https://rct.lukasbach.com/) to see more examples
and a more comprehensive documentation.

## Installation

To start using React Complex Table, install it to your project as a dependency via

```
npm install react-complex-tree
```

then import it and add your tree structure with

```typescript jsx
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';

<UncontrolledTreeEnvironment
  dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({...item, data}))}
  getItemTitle={item => item.data}
  viewState={{}}
>
  <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
</UncontrolledTreeEnvironment>
```

More details at [the Get-Started Guide](https://rct.lukasbach.com/docs/getstarted).

## Features

- __Unopinionated__
  
  React Complex Tree does not make any assumptions about any aesthetics of your web design or any technologies that you are using. The rendering is entirely up to you, and every node written to DOM can be customized. Sensible defaults styled by easily customizable CSS classes are provided to ease integration.

- __Accessible__
  
  The tree structure conforms to W3C's specification for accessible trees. It supports screen readers and implements all common keyboard interactions so that every interaction, from moving the focus to dragging items, is possible without using the mouse.

- __Powerful Drag and Drop__
  
  The tree provides the expected capabilities that power users expect from advanced tooling. Select as many items as you want, and drag them at any location within the same or any other tree! React Complex Tree comes with many customization options for Drag and Drop, such as disallowing reordering or enabling dragging or dropping on certain items only.

- __Full Keyboard Controls__
  
  The tree is entirely controllable via keyboard. It implements all controls suggested by the W3C to make trees accessible, and provides further controls for Drag and Drop, searching or renaming items.

- __Zero Dependencies__
  
  We know how annoying it is to add a package and end up with hundreds of peer dependencies. Because React Complex Tree does not make any assumptions on your any dependencies, we also do not need to cluster your project with further packages. When adding React Complex Tree to your package, you add only that and no other dependencies.

- __Multi-Selection__
  
  Other than other more simple tree libraries, React Complex Tree allows you to select as many items as you want, and move them all at once by dragging to a different location. Why provide your users with less functionality, when you can settle with powerful tree capabilities with no additional effort? Try it out on the demo above and select multiple items at once by holding control on your keyboard while clicking on items, then dragging all at once to a different location.

- __Renaming built in__
  
  React Complex Tree provides renaming as native feature with its capabilities. Select any item and press F2, to start renaming the item. This provides a more intuitive way of renaming items for users without implementing custom dialog solutions that are more disruptive to your users workflow.

- __Search Functionality__
  
  Have you ever tried to find that one file in an enormous chaotic file tree that you know is there, but have no idea where? Just start typing while focusing the tree, and the first item matching your search will show up. This also improves accessibility for the tree as keyboard-only users can more easily navigate the tree structure.

- __Multi-Tree Environments__
  
  You can use several trees on your web app that share a common state, and are able to interact with one another. The state and tree items are provided to a common react provider component, and as many trees as you want can easily be integrated by just adding tree components below the provider. The trees do not need to provide their own state, they just need an ID and their root item, all other logic is handled by the provider.

- __Controlled and Uncontrolled interfaces__
  
  The most easiest way of using React Complex Tree is using an uncontrolled tree environment that maintains the tree state, i.e. which items are selected, expanded, etc. itself. You only need to supply a data provider that defines how items are asynchronously loaded, and the environment does the rest. However, if you want more control, you can instead use the controlled environment for full customizable.

- __Powered by React and TypeScript__
  
  React Complex Tree is powered by React (duh) and is easily integrated in existing React projects by just importing and using the provided components. Comprehensive type information is given as TypeScript interfaces, that ease the integration and provide additional type safety, no matter whether you use TypeScript in your project or not.