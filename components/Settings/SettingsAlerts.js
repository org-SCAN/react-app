import React from "react";
import { View } from "react-native";
import CustomAlert from "../Alert/CustomAlert";
import CustomAlertTwoButtons from "../Alert/CustomAlertTwoButtons";
import { handleClear, openDocumentation } from "./SettingsHandler";

const SettingsAlerts = (props) => {
    const { intlData, alertStates, setAlertStates, dispatch } = props;
    
    return (
        <View>
            <CustomAlert title="✅" message={intlData.messages.Settings.emailRegistered} onConfirm={() => setAlertStates((prev) => ({ ...prev, emailCorrect: false }))} visible={alertStates.emailCorrect} />
            <CustomAlert title="❌" message={intlData.messages.Settings.emailParsingError} onConfirm={() => setAlertStates((prev) => ({ ...prev, emailError: false }))} visible={alertStates.emailError} />
            <CustomAlert title="✅" message={intlData.messages.Settings.downloadSuccess} onConfirm={() => setAlertStates((prev) => ({ ...prev, iconsDownloadCorrect: false }))} visible={alertStates.iconsDownloadCorrect} />
            <CustomAlert title="✅" message={intlData.messages.Settings.downloadTypeSuccess} onConfirm={() => setAlertStates((prev) => ({ ...prev, typesDownloadCorrect: false }))} visible={alertStates.typesDownloadCorrect} />
            <CustomAlert title="✅" message={intlData.messages.Settings.caseRegistered} onConfirm={() => setAlertStates((prev) => ({ ...prev, caseNumberUpdate: false }))} visible={alertStates.caseNumberUpdate} />
            
            <CustomAlertTwoButtons title="⚠️" message={intlData.messages.Settings.clearCases2} visible={alertStates.clearWarning}
                onConfirm={() => {
                    handleClear(dispatch);
                    setAlertStates((prev) => ({ ...prev, clearWarning: false })); 
                }}
                confirmButtonText={intlData.messages.yes}
                onCancel={() => setAlertStates((prev) => ({ ...prev, clearWarning: false }))}
                cancelButtonText={intlData.messages.no}
            />
            <CustomAlertTwoButtons title="❌" message={intlData.messages.Settings.missingIcons} visible={alertStates.iconsMissing}
                onConfirm={() => {
                    setAlertStates((prev) => ({ ...prev, iconsMissing: false })); 
                }}
                confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
                onCancel={() => {
                    openDocumentation();
                    setAlertStates((prev) => ({ ...prev, iconsMissing: false })); 
                }}
                cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
            />
            <CustomAlertTwoButtons title="❌" message={intlData.messages.Settings.missingTypes} visible={alertStates.typesMissing}
                onConfirm={() => {
                    setAlertStates((prev) => ({ ...prev, typesMissing: false })); 
                }}
                confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
                onCancel={() => {
                    openDocumentation();
                    setAlertStates((prev) => ({ ...prev, typesMissing: false })); 
                }}
                cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
            />
            <CustomAlertTwoButtons title="❌" message={intlData.messages.Settings.downloadTypeError} visible={alertStates.typesDownloadError}
                onConfirm={() => { 
                    setAlertStates((prev) => ({ ...prev, typesDownloadError: false })); 
                }}
                confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
                onCancel={() => {
                    openDocumentation();
                    setAlertStates((prev) => ({ ...prev, typesDownloadError: false })); 
                }}
                cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
            />
            <CustomAlertTwoButtons title="❌" message={intlData.messages.Settings.downloadError} visible={alertStates.iconsDownloadError}
                onConfirm={() => { 
                    setAlertStates((prev) => ({ ...prev, iconsDownloadError: false })); 
                }}
                confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
                onCancel={() => {
                    openDocumentation();
                    setAlertStates((prev) => ({ ...prev, iconsDownloadError: false })); 
                }}
                cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
            />
        </View>
    );
};

export default SettingsAlerts;
