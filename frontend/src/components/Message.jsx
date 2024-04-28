import React from 'react';

function Message({ userPhotoURL, messageText }) {
    return (
        <div className='flex items-center shadow-xl m-4 py-2 px-3 rounded-tl-full bg-coolGreen w-length'>
            <img src={userPhotoURL} alt='User' className='w-8 h-8 rounded-full' />
            <div className='ml-2'>
                <p>{messageText}</p>
            </div>
        </div>
    );
}

export default Message;
