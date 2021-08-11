import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    squareContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    square: {
        height: 200,
        width: 200
    },
    btn: {
        backgroundColor: 'white',
        height: 50,
        width: 80,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtBtn: {
        color: 'black'
    },
    btnsContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    valueContainer: {
        fontSize: 16,
        marginTop: 10
    },
    value: {
        color: 'white',
        textAlign: 'center'
    }

});