import React from 'react';

function Message({ message }) {
   
    return (
        <div className='flex items-center shadow-xl m-4 py-2 px-3 rounded-tl-full bg-coolGreen w-length'>
            <p className=' abosolute mt-[-4rem] text-black text-xs'> {message.name}</p>
            <div className='inline-block'>
                <p>{message.text}</p>
            </div>
        </div>
    );
}

export default Message;