# Dependencies refactor

## Expo version

You should check [here](https://docs.expo.dev/versions/latest/#each-expo-sdk-version-depends-on-a-react-native-version)
to keep track of the latest expo version and the compatible version of React and React native.  
In order to work with the current expo App we updated the project to SDK 53 but sdk 54 is now available &rarr; maybe it
can be useful to update.
Current version is :

| Expo SDK version | React Native version | React version | React Native Web version | Minimum Node.js version |  
|------------------|----------------------|---------------|--------------------------|-------------------------|
| 53.0.0           | 0.79                 | 19.0.0        | 0.20.0                   | 20.18.x                 |  

## Old package to remove
We have two outdated packages in the project.
```
"@rneui/base": "^4.0.0-rc.7",
"@rneui/themed": "^4.0.0-rc.7",
```
Both of them are in Release Candidate for 2 years now they might create security issue.  
They are used for the Icon system and need quit a big refactor.

## Dependabot rules

I added a `dependabot.yaml` configuration that will update the packages weekly.

## Automatic APK deployment

I created the action `deploy-apk` based on [this documentation](https://dev.to/jocanola/automate-your-expo-builds-with-eas-using-github-actions-a-step-by-step-guide-bik) in order to make it work you
should create an account on expo to get the token.  
The best thing to do is to create a generic account for SCAN.
