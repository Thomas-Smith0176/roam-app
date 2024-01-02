import { useState } from "react"
import { StyleSheet } from "react-native"
import { Button, TextInput, View } from "react-native-web"
import { Text } from "react-native-web"




export default function SignUp() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)


    const userData = {
        username: "",
        email: "",
        }

    function handleSubmit(){
        userData.username = username;
        userData.email = email;
        console.log(userData)
        setButtonDisabled(true)     

    }

     //API CALL TO SEND THESE DETAILS TO FIREBASE
        //SEPERATE PASSWORD API CALL TO STORE PASSWORD
        
        //Once all completed 




    return (

        <View> 
            <Text style={styles.text}>username</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Type here to translate!"
            onChangeText={newText => setUsername(newText)}
            defaultValue={username}
            />
            <Text style={styles.text}>email</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Type here to translate!"
                onChangeText={newText => setEmail(newText)}
                defaultValue={email}
            />
            <Text style={styles.text}>password</Text>
            <TextInput
            style={styles.textInput}
            placeholder="Type here to translate!"
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
            />

            <Button style={styles.button} disabled={buttonDisabled} title="submit" onPress={handleSubmit}/>

        </View>
    );



}


const styles = StyleSheet.create({
    container: {flex: 5, backgroundColor: "black", color: "white", fontSize: 20, alignContent: 'space-between'},
    textInput: {backgroundColor:"black", color:"white", height: 40, fontSize: 20},
    text: {fontSize: 20},
    button: {marginTop: 10}, 

})