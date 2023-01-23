const Message = ({ message }) => {
    let messageStyle = {};

    const hasMessage = Object.keys(message).length !== 0;

    message.class === 'success'
        ? messageStyle = {
            color: 'green',
            background: 'lightgrey',
            fontSize: 20,
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10
        }
        : message.class === 'failure'
            ? messageStyle = {
                color: 'red',
                background: 'lightgrey',
                fontSize: 20,
                borderStyle: 'solid',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10
            }
            : messageStyle = {};

    return (
        hasMessage === true
            ?
            <>
                <hr></hr>
                <div style={messageStyle}>
                    {message.text}
                </div >
            </>
            : null
    );
};

export default Message;