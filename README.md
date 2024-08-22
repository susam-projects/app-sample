## Installation

There's `.nvmrc` file with the required node version.

To install packages:
```
npm i
```

To start dev server:
```
npm run dev
```

To not input auth credentials manually each time you login, you can
create `.env.local` file in the root of the project with content like

```
VITE_AUTH_LOGIN=<login>
VITE_AUTH_PASSWORD=<password>
```


## Release build

To build the application:
```
npm run build
```


## Git workflow

[GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) with the following
branch types: `develop`, `main`, `release/*`, `bugfix/*`, `feature/*`, `refactoring/*`
It's possible to use more branch types for specific types of features.

A branch should be deleted after it was merged, with `release/*` branches as the only exception to this.


## Commit format

[Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
Expected commit prefixes: `fix:`, `feat:`, `build:`, `infra:`, `archi:`, `chore:`, `ci:`, `docs:`,
`style:`, `refactor:`, `perf:`, `test:`. Other prefixes are also possible if none of those
is appropriate for a specific case.


## Folder architecture

A modified ["Feature Driven Architecture"](https://github.com/feature-sliced/documentation/tree/rc/feature-driven).
Also, look at its [FAQ](https://github.com/feature-sliced/documentation/blob/rc/feature-driven/FAQ.md#how-to-structure).

**NOTABLE DIFFERENCE:**

Here we have 3 types of features: `features`, `feature-blocks`, and `composite-features`.
You can think about them as `features` is the main type; but if you need to reuse
some feature or some part of it, place it in `feature-blocks` instead; and in the
opposite case, if you need to use something from an existing feature, place the
feature you're working at (or a part of it) into `composite-features`.

The idea is to simplify dependencies:
- `feature-blocks` should not import anything except common modules
- `features` are also allowed to import `feature-blocks`
- `composite-features` are also allowed to import `features`


## Styles

### Styles location and styles file name

In order for the linter to work, the styles should be in separate files only and
the name of a styles file should either contain one of the suffixes: `.style`,
`.styles`, `.styled`, or the whole filename should be one of: `style.ts`,
`styles.ts`, `styled.ts`.

E.g.
```js
Component.tsx // wrong name, will NOT be linted
Component.styl.ts // wrong name, will NOT be linted
Component.styles // wrong name, will NOT be linted
Component.styles.ts // right name, will be linted
Component.style.tsx // right name, will be linted

mystyles.ts // wrong name, will NOT be linted
styles.ts // right name, will be linted
styled.tsx // right name, will be linted
style.ts // right name, will be linted
```


### CSS object vs CSS function

The linter can't recognize styles in objects, so always use the `css` function.

E.g.
```js
export const useStyles = createStyles(({ css }) => ({
  /* The first class will NOT be linted */
  container: {
    padding: 0,
    margin: 0,
  },
  /* Only this one will be */
  sampleRoot: css`
    height: 100vh;
    background-color: #f9fbfd;
  `,
}));
```

Note: it's also ok to use `createGlobalStyle` function.


### Comments

Don't use double-slash comments in styles. The parser [doesn't support it](https://www.npmjs.com/package/postcss-styled-syntax#known-issues).

So, instead of this:
```js
sampleClassName: css`
  // margin: 0;
  // padding: 0;
  height: 100vh;
  background-color: #f9fbfd;
`
```
write this:
```js
sampleClassName: css`
  /*margin: 0;
  padding: 0;*/
  height: 100vh;
  background-color: #f9fbfd;
`
```
And if you get such error while linting styles
```shell
src/Example.styles.ts
 13:10  ✖  Unknown word  CssSyntaxError
```
Just check if there are any double-slash comments.


## Useful links

[antd docs](https://ant.design/components/overview)

[antd-styles docs](https://ant-design.github.io/antd-style/guide/create-styles)
