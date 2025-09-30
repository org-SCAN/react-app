# Dependencies refactor

## Expo version

You should check [here](https://docs.expo.dev/versions/latest#each-expo-sdk-version-depends-on-a-react-native-version)
to keep track of the latest expo version and the compatible version of React and React native.  
The project has been updated to SDK 54.

Current version is :

| Expo SDK version | React Native version | React version | React Native Web version | Minimum Node.js version |  
|------------------|----------------------|---------------|--------------------------|-------------------------|
| 54.0.0           | 0.81                 | 19.1.0        | 0.21.0                  | 20.19.x                 |  

## Old package to remove
We have two outdated packages in the project.

Both of them are in Release Candidate for 2 years now they might create security issue. 

"@rneui/base": "^4.0.0-rc.7",
"@rneui/themed": "^4.0.0-rc.7", 

They are used for the Icon system and need quit a big refactor.

Migration completed to React Native Paper (actively maintained) + @expo/vector-icons.

Global provider → PaperProvider

Icons → @expo/vector-icons (MaterialIcons, MaterialCommunityIcons, ...)

Relevant dependencies:

react-native-paper
react-native-svg
@expo/vector-icons (via Expo)

## Dependabot rules

I added a `dependabot.yaml` configuration that will update the packages weekly.

## Automatic APK deployment

I created the action `deploy-apk` based on [this documentation](https://dev.to/jocanola/automate-your-expo-builds-with-eas-using-github-actions-a-step-by-step-guide-bik) in order to make it work you
should create an account on expo to get the token.  
The best thing to do is to create a generic account for SCAN.
