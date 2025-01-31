# expo-starter

a starter pack template for expo router

## prerequisite

- [android studio](https://developer.android.com/)
- [node.js](https://nodejs.org/en)

## features

- [react native](https://reactnative.dev/)
- [expo](https://expo.dev/)
- [nativewind](https://www.nativewind.dev/)
- [typescript](https://www.typescriptlang.org/)
- [lucide-react-native](https://lucide.dev/guide/packages/lucide-react-native)
- [eslint & prettier](https://docs.expo.dev/guides/using-eslint/)

## for developers

### install dependencies

```bash
npm install
```

### build production

```bash
eas login # login your account
eas build --profile production
```

### developer production

```bash
# start the developer server
npm expo start

# prebuild developer build
npx expo prebuild
npx expo run:android
```

### analyzing code for potential errors or debugging

```bash
npx expo lint
npx expo-doctor
```

### references

[Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/)
