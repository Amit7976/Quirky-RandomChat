let userUnique = '';
let intervalId;
let oldMessage = [11111];
let friendAvatar = '';
let messagesByDate = {};
let htmlContent = '';
let reported = false;
let blocked = false;
let allChat = document.getElementById("allChat");
let media = null;
allChat.scrollTo({
    top: allChat.scrollHeight,
    behavior: 'smooth'
});


let sendMessageButtonHtml = `<div class="flex gap-1 items-center w-fit px-3">
                        <div class="hidden text-gray-600 relative md:flex justify-between items-center min-w-fit select-none px-5 py-3 rounded-lg">
                            <input type="checkbox" name="" id="toggleEmojiSection" class="peer hidden outline-none">
                            <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                            <label for="toggleEmojiSection" class="cursor-pointer top-0 left-0 h-full">
                                <svg class="w-9 h-9 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                </svg>
                            </label>
                            <div id="EmojiContainer" class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-full left-0 w-96 bg-white dark:bg-black shadow-xl bg-opacity-100 rounded-2xl overflow-hidden">
                               
                            </div>
                        </div>
                        <div>
                        <div class="hidden text-gray-600 relative md:flex justify-between items-center min-w-fit select-none rounded-lg">
                            <input type="checkbox" name="" id="toggleImagePreview" class="peer hidden outline-none">
                            <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                            <label for="toggleImagePreview" class="cursor-pointer top-0 left-0 h-full">
                            </label>
                            <div id="imagePreviewContainer" class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-full left-0 w-96 h-auto shadow-xl bg-opacity-100 rounded-2xl overflow-hidden flex flex-col justify-between items-end" style="background: rgba( 0, 0, 0, 0.4 );box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );backdrop-filter: blur( 4.5px );-webkit-backdrop-filter: blur( 4.5px );border-radius: 10px;border: 1px solid rgba( 255, 255, 255, 0.18 );">
                                <button onclick="removeImagePreview()" class="z-10 px-4 py-2 rounded-bl-xl absolute top-0 right-0 bg-white dark:bg-[#101419] shadow-xl">
                                <svg class="w-4 h-4  fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                </svg>
                                </button>
                                <div class="flex justify-center items-center w-full py-4 max-h-[50vh] relative object-contain overflow-hidden">
                                    <img id="imagePreview" class="object-contain w-auto h-full max-h-[inherit]" alt="Preview">
                                </div>
                            
                                <div class="bg-white dark:bg-black p-2 w-full flex justify-end">
                                <button id="sendImageButton" class="z0-10 w-fit text-sm bg-red-500 shadow-2xl rounded-md px-4 py-3 fill-white text-white flex gap-2 items-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">Send
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                                    </svg>
                                    </button></div>
                            </div>
                        </div>
                        <label for="imageInput" class="cursor-pointer">
                            <svg class="w-9 h-9 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
                            </svg>
                        </label>
                        <input type="file" hidden id="imageInput" accept=".jpg, .jpeg, .png">
                    </div>
                    </div>
                    <div class="w-full">
                        <input id="message" onkeypress="messageInput(event)" autofocus class="w-full bg-transparent outline-none border-0 text-black dark:text-white placeholder:text-gray-400 h-12 px-10 py-1" type="text" id="message" placeholder="Type a message">
                    </div>
                    <div id="sendMessage" onclick="sendMessage()" class="w-fit px-3">
                        <svg class="w-10 h-10 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                        </svg>
                    </div>`;
/////////////////////////////////////////////////////////////////////////////////
////////////// GET ALL DETAILS ABOUT CURRENT USER AND  FRIEND START /////////////
/////////////////////////////////////////////////////////////////////////////////

function startChat(user_unique) {
    closeShowAllMedia();
    userUnique = '';
    intervalId;
    oldMessage = [11111];
    friendAvatar = '';
    messagesByDate = {};
    htmlContent = '';
    document.getElementById("sendingMessage").innerHTML = "";

    document.getElementById("startingTab").style.display = 'none';
    document.getElementById("chattingTab").style.display = 'block';
    document.getElementById("personTab").style.display = 'block';
    userUnique = user_unique;
    allChat.innerHTML = "";

    let friend = false;

    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            fetchDetails: 'fetchDetails',
            user_unique: user_unique,
        },
        success: function (response) {
            console.log(response);
            const details = JSON.parse(response);

            if (details.status === "Success") {
                // const fetchedDetails = details.details;

                if (details.isReported) {
                    reported = true;
                    document.getElementById("personProfileReportButton").style.background = "#888888";
                    document.getElementById("personProfileReportButton").style.fill = "white";

                    document.getElementById("sendingMessage").innerHTML = "";
                    document.getElementById("sendingMessage").innerHTML = sendMessageButtonHtml;

                    openEmoji();
                    imageMessage();

                    if (details.isFriend) {
                        friend = true;
                        document.getElementById("personProfileUnfriend").style.display = "none";
                        document.getElementById("personProfileFriend").style.display = "block";
                        document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                        document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                        document.getElementById("chattingPersonProfileFriend").style.display = "block";
                        document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";

                    } else if (details.isSendRequest) {
                        document.getElementById("personProfileUnfriend").style.display = "none";
                        document.getElementById("personProfileFriend").style.display = "none";
                        document.getElementById("personProfileFriendRequestSendByYou").style.display = "block";
                        document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                        document.getElementById("chattingPersonProfileFriend").style.display = "none";
                        document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "block";

                    } else {
                        document.getElementById("personProfileUnfriend").style.display = "block";
                        document.getElementById("personProfileFriend").style.display = "none";
                        document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                        document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                        document.getElementById("chattingPersonProfileFriend").style.display = "none";
                        document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";
                    }

                } else if (details.isFriend) {
                    friend = true;
                    document.getElementById("personProfileReportButton").style.background = "transparent";
                    document.getElementById("personProfileReportButton").style.fill = "#9ca3af";

                    document.getElementById("personProfileUnfriend").style.display = "none";
                    document.getElementById("personProfileFriend").style.display = "block";
                    document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                    document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                    document.getElementById("chattingPersonProfileFriend").style.display = "block";
                    document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";

                    document.getElementById("sendingMessage").innerHTML = "";
                    document.getElementById("sendingMessage").innerHTML = sendMessageButtonHtml;

                    openEmoji();
                    imageMessage();




                } else if (details.isSendRequest) {
                    document.getElementById("personProfileReportButton").style.background = "transparent";
                    document.getElementById("personProfileReportButton").style.fill = "#9ca3af";

                    document.getElementById("personProfileUnfriend").style.display = "none";
                    document.getElementById("personProfileFriend").style.display = "none";
                    document.getElementById("personProfileFriendRequestSendByYou").style.display = "block";
                    document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                    document.getElementById("chattingPersonProfileFriend").style.display = "none";
                    document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "block";



                } else {
                    document.getElementById("personProfileReportButton").style.background = "transparent";
                    document.getElementById("personProfileReportButton").style.fill = "#9ca3af";

                    document.getElementById("personProfileUnfriend").style.display = "block";
                    document.getElementById("personProfileFriend").style.display = "none";
                    document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                    document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                    document.getElementById("chattingPersonProfileFriend").style.display = "none";
                    document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";
                }



                console.log(details.isRequest);
                if (details.isRequest) {
                    document.getElementById("personProfileFriendRequestButton").style.display = "block";
                } else {
                    document.getElementById("personProfileFriendRequestButton").style.display = "none";
                }



                if (!details.isNotificationOff) {
                    document.getElementById("chattingPersonProfileMute").style.background = "transparent";
                    document.getElementById("personProfileMuteButton").style.background = "transparent";
                    document.getElementById("chattingPersonProfileMute").style.fill = "#9ca3af";
                    document.getElementById("personProfileMuteButton").style.fill = "#9ca3af";
                } else {
                    document.getElementById("chattingPersonProfileMute").style.background = "#888888";
                    document.getElementById("personProfileMuteButton").style.background = "#888888";
                    document.getElementById("chattingPersonProfileMute").style.fill = "white";
                    document.getElementById("personProfileMuteButton").style.fill = "white";
                }














                $.ajax({
                    type: "POST",
                    url: "php/backend-index.php",
                    data: {
                        fetchData: 'fetchData',
                        user_unique: user_unique,
                    },
                    success: function (response) {
                        // console.log(response);
                        const data = JSON.parse(response);

                        if (data.status === "Success") {
                            const fetchedData = data.data;

                            document.getElementById("chattingPersonProfileImage").src = "img/avatar/" + fetchedData.avatar;
                            document.getElementById("chattingPersonProfileName").innerText = fetchedData.name;

                            if (fetchedData.status === "Online") {
                                document.getElementById("chattingPersonProfileStatus").innerHTML = '<span class="text-sm mt-1 text-green-600 capitalize">' + fetchedData.status + '</span>';
                                document.getElementById("personProfileStatus").innerHTML = '<span class="text-sm mt-1 text-green-600 capitalize">' + fetchedData.status + '</span>';
                            } else if (fetchedData.status === "Offline") {
                                document.getElementById("chattingPersonProfileStatus").innerHTML = '<span class="text-sm mt-1 text-red-600 capitalize">' + fetchedData.status + '</span>';
                                document.getElementById("personProfileStatus").innerHTML = '<span class="text-sm mt-1 text-red-600 capitalize">' + fetchedData.status + '</span>';
                            }

                            document.getElementById("personProfileImage").src = "img/avatar/" + fetchedData.avatar;
                            document.getElementById("personProfileName").innerText = fetchedData.name;
                            document.getElementById("personProfileUserName").innerText = fetchedData.userName;
                            document.getElementById("personProfileDescription").innerText = fetchedData.description;
                            document.getElementById("personProfileNumber").innerText = fetchedData.number;
                            document.getElementById("personProfileGender").innerText = fetchedData.gender;
                            document.getElementById("personProfileCountry").innerText = fetchedData.country;

                            document.getElementById("blockModalImage").src = "img/avatar/" + fetchedData.avatar;
                            document.getElementById("unblockModalImage").src = "img/avatar/" + fetchedData.avatar;
                            document.getElementById("unfriendImage").src = "img/avatar/" + fetchedData.avatar;
                            document.getElementById("removeReportImage").src = "img/avatar/" + fetchedData.avatar;

                            // console.log(data.isBlocked);
                            // console.log(data.isReported);
                            // console.log(data.isNotificationOff);
                            // console.log(data.isFriend);

                            if (data.isBlocked) {
                                document.getElementById("personProfileImage").style.opacity = '0.4';
                                document.getElementById("personProfileImage").style.border = '4px';
                            } else {
                                document.getElementById("personProfileImage").style.opacity = '1';
                                document.getElementById("personProfileImage").style.border = '0px';
                            }

                            if (data.isFriend && friend) {
                                document.getElementById("personProfileImage").style.border = '4px solid #ff005f';
                                document.getElementById("personTabIsFriend").style.display = 'block';
                                document.getElementById("personTabIsFriend").innerText = 'Friends';

                                document.getElementById("chattingPersonProfileImage").style.border = '3px solid #ff005f';
                                document.getElementById("chattingPersonIsFriend").style.display = 'block';
                            } else {
                                document.getElementById("personProfileImage").style.border = '0px';
                                document.getElementById("personTabIsFriend").style.display = 'none';
                                document.getElementById("personTabIsFriend").innerText = '';

                                document.getElementById("chattingPersonProfileImage").style.border = '0px';
                                document.getElementById("chattingPersonIsFriend").style.display = 'none';
                            }







                            friendAvatar = fetchedData.avatar;
                            console.log(friendAvatar);
                            const hobbiesArray = fetchedData.hobbies.split(', ');

                            document.getElementById("personProfileHobbies").innerHTML = "";
                            hobbiesArray.forEach(hobby => {
                                document.getElementById("personProfileHobbies").innerHTML += `<p class="rounded-full px-5 py-1 text-sm text-gray-700 dark:text-gray-400 bg-gray-gray-200 dark:bg-gray-900">` + hobby + `</p>`;
                            });
                            console.log(hobbiesArray);
                            console.log(hobbiesArray.length);
                            if (hobbiesArray[0].length < 1) {
                                document.getElementById("isPersonProfileHobbies").style.display = "none";
                                document.getElementById("personProfileHobbies").style.display = "none";
                            }



                            media = data.mediaFiles;

                            document.getElementById("allChatMedia").innerHTML = "";
                            for (let i = 1; i <= 6; i++) {
                                if (media[i]) {
                                    document.getElementById("allChatMedia").innerHTML += `<a class="cursor-pointer" target="_blank" href="img/chatImage/` + media[i] + `"><img class="w-full h-auto rounded-lg" src="img/chatImage/` + media[i] + `" alt="` + media[i] + `"></a>`;
                                }
                            }





                            lastFetchedChatId = 0;
                            lastFetchedTimestamp = 0;


                        }
                    },
                    error: function (xhr, status, error) {
                        // Handle AJAX errors here
                        console.error(xhr, status, error);
                    }
                });



                // FIX:  NOT WORKING PROPERLY

                if (!details.isBlocked) {
                    // Initial fetch after 100ms
                    setTimeout(() => {
                        fetchChat();

                        // Set interval for subsequent fetchChat calls every 500ms
                        intervalId = setInterval(fetchChat, 500);

                        // Scroll to the bottom after the first fetchChat completes
                        // Adjust the delay according to your needs

                    }, 100); // Initial delay


                    blocked = false;
                    document.getElementById("chattingPersonProfileBlockedUser").style.display = "none";
                    document.getElementById("personProfileBlockedUser").style.display = "none";

                    document.getElementById("personProfileBlockButton").style.background = "transparent";
                    document.getElementById("personProfileBlockButton").style.fill = "#9ca3af";

                } else {
                    clearInterval(intervalId);
                    allChat.innerHTML = "";
                    allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Blocked by You</p>
                        </div>
                    </div>`;
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                    blocked = true;
                    document.getElementById("personProfileBlockButton").style.background = "#888888";
                    document.getElementById("personProfileBlockButton").style.fill = "white";


                    document.getElementById("chattingPersonProfileBlockedUser").style.display = "block";
                    document.getElementById("personProfileBlockedUser").style.display = "block";
                    document.getElementById("personProfileUnfriend").style.display = "none";
                    document.getElementById("personProfileFriend").style.display = "none";
                    document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                    document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                    document.getElementById("chattingPersonProfileFriend").style.display = "none";
                    document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";


                    setTimeout(() => {
                        allChat.scrollTop = allChat.scrollHeight;

                    }, 200);

                }
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors here
            console.error(xhr, status, error);
        }
    });

}

/////////////////////////////////////////////////////////////////////////////////
////////////// GET ALL DETAILS ABOUT CURRENT USER AND  FRIEND END ///////////////
/////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SHOW ALL MEDIA FILES START /////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function showAllMedia() {
    let showAllMediaButton = document.getElementById("showAllMediaButton");
    let ChatMediaContainer = document.getElementById("ChatMediaContainer");
    document.getElementById("defaultDetails").style.display = 'none';

    document.getElementById("allChatMedia").innerHTML = "";
    media.forEach(mediaFile => {
        document.getElementById("allChatMedia").innerHTML += `<a class="cursor-pointer" target="_blank" href="img/chatImage/` + mediaFile + `"><img class="w-full h-auto rounded-lg" src="img/chatImage/` + mediaFile + `" alt="` + mediaFile + `"></a>`;
    });

    showAllMediaButton.innerText = 'Close';
    showAllMediaButton.setAttribute('onclick', 'closeShowAllMedia()');
    ChatMediaContainer.classList.remove('top-0');
    ChatMediaContainer.classList.add('absolute', 'z-50', 'top-5', 'h-screen')
}

function closeShowAllMedia() {
    let showAllMediaButton = document.getElementById("showAllMediaButton");
    let ChatMediaContainer = document.getElementById("ChatMediaContainer");
    document.getElementById("defaultDetails").style.display = 'block';

    document.getElementById("allChatMedia").innerHTML = "";
    if (media !== null) {
        for (let i = 1; i <= 6; i++) {
            if (media[i]) {
                document.getElementById("allChatMedia").innerHTML += `<a class="cursor-pointer" target="_blank" href="img/chatImage/` + media[i] + `"><img class="w-full h-auto rounded-lg" src="img/chatImage/` + media[i] + `" alt="` + media[i] + `"></a>`;
            }
        }
    }

    showAllMediaButton.innerText = 'View All';
    showAllMediaButton.setAttribute('onclick', 'showAllMedia()');
    ChatMediaContainer.classList.remove('absolute', 'z-50', 'top-5', 'h-screen');
    ChatMediaContainer.classList.add('top-0');

}



/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SHOW ALL MEDIA FILES END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// OPEN EMOJI CONTAINER END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function openEmoji() {
    const picker = new EmojiMart.Picker({
        // Reference the input element
        target: document.querySelector('#message'),

        icons: 'outline',
        locale: 'en',
        navPosition: 'top',
        previewPosition: 'none',
        searchPosition: 'top',
        skinTonePosition: 'search',
        set: 'google',
        perLine: 6,
        noCountryFlags: true,
        maxFrequentRows: 6,
        autoFocus: true,
        emojiSize: 40,
        emojiButtonSize: 50,
        dynamicWidth: true,

        onEmojiSelect: (emoji) => {
            insertEmojiIntoInput(emoji.native);
        }
    });

    function insertEmojiIntoInput(emoji) {
        const input = document.querySelector('#message');
        const cursorPosition = input.selectionStart;
        const textBeforeCursor = input.value.substring(0, cursorPosition);
        const textAfterCursor = input.value.substring(cursorPosition);

        input.value = textBeforeCursor + emoji + textAfterCursor;

        // Move the cursor to the end of the inserted emoji
        input.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);

        // Trigger the input event to update any event listeners or bindings
        input.dispatchEvent(new Event('input'));

        // Set focus back to the input
        input.focus();

        // Hide EmojiContainer after selecting an emoji
        document.getElementById("toggleEmojiSection").click();
    }

    // Append the picker to the EmojiContainer
    document.getElementById("EmojiContainer").appendChild(picker);

    // Toggle EmojiContainer visibility on checkbox change
    document.getElementById('toggleEmojiSection').addEventListener('change', function () {
        const emojiContainer = document.getElementById("EmojiContainer");
        emojiContainer.classList.toggle('invisible', !this.checked);
        emojiContainer.classList.toggle('opacity-0', !this.checked);
    });
}


/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// OPEN EMOJI CONTAINER END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// FETCH ALL CHAT START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function fetchChat() {
    // console.log("hii");
    // console.log(friendAvatar);
    // console.log(oldMessage);

    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            fetchChats: 'fetchChats',
            user_unique: userUnique,
            oldMessage: oldMessage,
        },
        success: function (response) {
            // console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {

                // Clear the content before appending new messages
                // allChat.innerHTML = '';
                // console.log(allChat.innerHTML);
                // console.log(oldMessage);

                // UPDATE STATUS
                updateStatus(data.userStatus);

                data.data.forEach(chatMessage => {
                    oldMessage.push(chatMessage.c_unique_id);

                    const messageDate = new Date(chatMessage.c_date_time);
                    const formattedDate = getFormattedDate(messageDate);

                    // Check if the message already exists to avoid duplicates
                    if (!messagesByDate[formattedDate]) {
                        messagesByDate[formattedDate] = [];
                    }

                    if (!messagesByDate[formattedDate].some(msg => msg.c_unique_id === chatMessage.c_unique_id)) {
                        messagesByDate[formattedDate].push(chatMessage);
                    }
                });

                Object.keys(messagesByDate).forEach(date => {
                    htmlContent += `<div class="w-full p-3 my-20 select-none flex justify-center items-center">
                                        <div class="w-1/2 flex items-center justify-center">
                                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent border-2 border-black text-black dark:border-white dark:text-white">${date}</p>
                                        </div>
                                    </div>`;

                    messagesByDate[date].forEach(chatMessage => {
                        const inputDate = new Date(chatMessage.c_date_time);
                        const formattedTime = inputDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });


                        if (chatMessage.c_message.length > 0) {
                            if (chatMessage.c_sender == userUnique) {
                                htmlContent += `
                                <div id="fullMessageContainer${chatMessage.c_unique_id}" onmouseenter="document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'flex';" onmouseleave="(document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ?document.addEventListener('click', () => (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}') ? (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ? document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').click() : ''):'' )) :document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'none')" class="w-full p-3 flex justify-start items-center">
                                    <div id="chatContainer${chatMessage.c_unique_id}" class="w-full flex items-end gap-2">
                                        <img class="w-10 h-10 rounded-full object-cover" src="img/avatar/${friendAvatar}" alt="">
                                        <div class="max-w-[50%] ${(chatMessage.c_replier.length > 0 ? `min-w-[30%]` : '')}">
                                        ${(chatMessage.c_forward.length > 0 ? `<p class="text-xs mb-2 text-gray-600 italic dark:text-gray-400">Forward Message</p>` : '')}
                                        <div class="flex gap-2 items-center w-full mb-2 relative">
                                            <div class="w-full mb-2 bg-white dark:bg-black p-2 rounded-xl rounded-bl-none">
                                                    ${(chatMessage.c_replier.length > 0 ? (chatMessage.c_reply_message.length > 0 ? `
                                                                <a href="#fullMessageContainer`+ chatMessage.c_unique_id + `" class="block w-full px-5 py-2 bg-[#222d38] rounded-t-xl border-l-2 border-white relative" >
                                                    <p class="text-black dark:text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                    <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">`+ chatMessage.c_reply_message + `</p>
                                                    </a>
                                                            `: (chatMessage.c_reply_image.length > 0 ? `
                                                            <a  href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="w-full px-5 py-2 bg-[#222d38] rounded-xl border-l-2 border-white relative flex justify-between" >
                                                        <div class="w-full">
                                                            <p class="text-black dark:text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                            <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">Image</p>
                                                        </div>
                                                        <div class="w-fit">
                                                            <img class="max-w-28 max-h-20 rounded-md" src="img/chatImage/`+ chatMessage.c_reply_image + `" alt="">
                                                        </div>
                                                    </a>`: ``)) : ``)}
                                                <div id="chatMessage${chatMessage.c_unique_id}" class="chat duration-300 rounded-2xl rounded-bl-none shadow-2xl break-all hyphens-auto p-2 px-4 bg-gray-100 dark:bg-black text-black dark:text-white ${(chatMessage.c_replier.length > 0 ? `justify-between` : '')} ${(chatMessage.c_message.length > 30) ? 'block' : 'flex gap-4 items-end'}">
                                                    <p id="chatMessageText${chatMessage.c_unique_id}">${chatMessage.c_message}</p>
                                                    <div class="${(chatMessage.c_message.length > 30) ? 'justify-end mt-1' : ''} flex gap-1 items-center">
                                                        <p id="formattedTime${chatMessage.c_unique_id}" class="text-xs text-gray-600 dark:text-gray-400">${formattedTime}</p>
                                                        <p id="starMarkSign${chatMessage.c_unique_id}">${(chatMessage.c_star == 1 ? `<svg class="w-[0.80rem] h-[0.80rem]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                                <path fill="#FFB636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" />
                                                                <path fill="#FFD469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5c-1.6.2-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4c.2 1.6 1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6c1 1.3 2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" />
                                                            </svg>` : '')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="chat${chatMessage.c_unique_id}" class="hidden text-gray-600 absolute left-full justify-between items-center min-w-fit select-none rounded-lg">
                                                <input type="checkbox" name="" id="toggleChatMenu${chatMessage.c_unique_id}" class="peer hidden outline-none">
                                                <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                                <label for="toggleChatMenu${chatMessage.c_unique_id}" class="cursor-pointer top-0 left-0 h-full">
                                                    <svg class="w-8 h-8 fill-gray-700 dark:fill-gray-300 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                                                </label>
                                                <ul class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-0 left-full w-40 bg-gray-200 dark:bg-gray-800 shadow-xl bg-opacity-100 rounded-2xl overflow-hidden py-2 px-1">
                                                    <li onclick="messageReply(${chatMessage.c_unique_id},'Friend','Text','${chatMessage.c_message}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Reply</li>

                                                    <li onclick="copyTextAndScale('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                                                <path d="m4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1zm9 3l-3-3H5v10h8z" />
                                                                <path d="M3 1L2 2v10l1 1V2h6.414l-1-1z" />
                                                            </g>
                                                        </svg> Copy</li>
                                                    <li onclick="messageForward('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="transform: rotateY(180deg);">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Forward</li>
                                                    <li id="starMark${chatMessage.c_unique_id}" ${(chatMessage.c_star == 1 ? 'onclick="starMarkRemoveFromMessage(' + chatMessage.c_unique_id + ')"' : 'onclick="starMarkMessage(' + chatMessage.c_unique_id + ')"')} class="flex items-center capitalize text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                        ${(chatMessage.c_star == 1 ? `<svg class="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0" />
                                                        </svg>` : `<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z" />
                                                        </svg>`)} ${(chatMessage.c_star == 1 ? 'UnStar' : 'Star')}</li>
                                                    <li onclick="singleMessageDelete('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1" />
                                                        </svg> Delete</li>
                                                </ul>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                `;
                            } else {
                                htmlContent += `
                                 <div id="fullMessageContainer${chatMessage.c_unique_id}" onmouseenter="document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'flex';" onmouseleave="(document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ?document.addEventListener('click', () => (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}') ? (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ? document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').click() : ''):'' )) :document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'none')" class="w-full p-3 flex justify-end relative items-center">
                                    <div class="max-w-[50%] ${(chatMessage.c_replier.length > 0 ? `min-w-[30%]` : '')}">
                                        ${(chatMessage.c_forward.length > 0 ? `<p class="text-xs mb-2 text-gray-600 italic dark:text-gray-400">Forward Message</p>` : '')}
                                        <div class="flex gap-2 items-center w-full mb-2 relative">
                                            <div id="chat${chatMessage.c_unique_id}" class="hidden text-gray-600 absolute ${(chatMessage.c_replier.length > 0 ? `right-full` : '-left-10')} justify-between items-center min-w-fit select-none rounded-lg">
                                                <input type="checkbox" name="" id="toggleChatMenu${chatMessage.c_unique_id}" class="peer hidden outline-none">
                                                <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                                <label for="toggleChatMenu${chatMessage.c_unique_id}" class="cursor-pointer top-0 left-0 h-full">
                                                    <svg class="w-8 h-8 fill-gray-700 dark:fill-gray-300 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                                                </label>
                                                <ul class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-0 right-full w-40 bg-gray-200 dark:bg-gray-800 shadow-xl bg-opacity-100 rounded-2xl overflow-hidden py-2 px-1">
                                                    <li onclick="messageReply(${chatMessage.c_unique_id},'You','Text','${chatMessage.c_message}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Reply</li>

                                                    <li onclick="copyTextAndScale('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                                                <path d="m4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1zm9 3l-3-3H5v10h8z" />
                                                                <path d="M3 1L2 2v10l1 1V2h6.414l-1-1z" />
                                                            </g>
                                                        </svg> Copy</li>
                                                    <li onclick="messageForward('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="transform: rotateY(180deg);">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Forward</li>
                                                    <li id="starMark${chatMessage.c_unique_id}" ${(chatMessage.c_star == 1 ? 'onclick="starMarkRemoveFromMessage(' + chatMessage.c_unique_id + ')"' : 'onclick="starMarkMessage(' + chatMessage.c_unique_id + ')"')} class="flex items-center capitalize text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                        ${(chatMessage.c_star == 1 ? `<svg class="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0" />
                                                        </svg>` : `<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z" />
                                                        </svg>`)} ${(chatMessage.c_star == 1 ? 'UnStar' : 'Star')}</li>
                                                    <li onclick="singleMessageDelete('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1" />
                                                        </svg> Delete</li>
                                                </ul>
                                            </div>

                                            <div class="bg-black dark:bg-white rounded-xl rounded-br-none p-1 w-full">
                                            ${(chatMessage.c_replier.length > 0 ? (chatMessage.c_reply_message.length > 0 ? `
                                                                <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="block w-full px-5 py-2 dark:bg-[#dcdcdc] bg-[#222d38] rounded-t-xl border-l-2 dark:border-black border-white relative" >
                                                    <p class="dark:text-black text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                    <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">`+ chatMessage.c_reply_message + `</p>
                                                    </a>
                                                            `: (chatMessage.c_reply_image.length > 0 ? `
                                                            <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="w-full px-5 py-2 dark:bg-[#dcdcdc] bg-[#222d38] rounded-t-xl border-l-2 dark:border-black border-white relative flex justify-between" >
                                                        <div class="w-full">
                                                            <p class="dark:text-black text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                            <p class="dark:text-gray-700 mt-2 text-gray-500 text-xs truncate overflow-hidden">Image</p>
                                                        </div>
                                                        <div class="w-fit">
                                                            <img class="max-w-28 max-h-10 rounded-md" src="img/chatImage/`+ chatMessage.c_reply_image + `" alt="">
                                                        </div>
                                                    </a>`: ``)) : ``)}
                                            <div id="chatMessage${chatMessage.c_unique_id}" class="chat duration-300 rounded-2xl rounded-br-none shadow-2xl break-all hyphens-auto p-2 px-4 bg-black dark:bg-white text-white dark:text-black ${(chatMessage.c_replier.length > 0 ? `justify-between` : '')} ${(chatMessage.c_message.length > 30) ? 'block' : 'flex gap-4 items-end'}">
                                                <p id="chatMessageText${chatMessage.c_unique_id}">${chatMessage.c_message}</p>
                                                <div class="${(chatMessage.c_message.length > 30) ? 'justify-end mt-1' : ''} flex gap-1 items-center">
                                                    <p id="formattedTime${chatMessage.c_unique_id}" class="text-xs text-gray-400 dark:text-gray-600">${formattedTime}</p>
                                                    <p id="starMarkSign${chatMessage.c_unique_id}">${(chatMessage.c_star == 1 ? `<svg class="w-[0.80rem] h-[0.80rem]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="#FFB636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" />
                                                            <path fill="#FFD469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5c-1.6.2-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4c.2 1.6 1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6c1 1.3 2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" />
                                                        </svg>` : '')}</p>
                                                    ${((chatMessage.c_seen == 1) ? `<svg class="w-[0.80rem] h-[0.80rem] fill-white dark:fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                        <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                                                    </svg>`: ((chatMessage.c_reached == 1) ? `<svg class="w-[0.80rem] h-[0.80rem] fill-gray-400 dark:fill-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                                                    </svg>`: ``))
                                    }
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
                            }
                        } else if (chatMessage.c_image.length > 0) {
                            if (chatMessage.c_sender == userUnique) {
                                htmlContent += `
                                <div id="fullMessageContainer${chatMessage.c_unique_id}" onmouseenter="document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'flex';" onmouseleave="(document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ?document.addEventListener('click', () => (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}') ? (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ? document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').click() : ''):'' )) :document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'none')" class="w-full p-3 flex justify-start items-center">
                                    <div id="chatContainer${chatMessage.c_unique_id}" class="w-full flex items-end gap-2">
                                        <img class="w-10 h-10 rounded-full object-cover" src="img/avatar/${friendAvatar}" alt="">

                                        <div id="chatMessage${chatMessage.c_unique_id}" class="w-full p-0 bg-transparent text-black dark:text-white flex gap-2 items-center">
                                            <div class="max-w-[50%] w-fit -mb-2">
                                            <div class="${(chatMessage.c_replier.length > 0 ? 'p-2 pb-0 bg-white dark:bg-black rounded-t-xl' : '')}">
                                                    ${(chatMessage.c_replier.length > 0 ? (chatMessage.c_reply_message.length > 0 ? `
                                                                <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="block w-full px-5 py-2 bg-[#222d38] rounded-t-xl border-l-2 border-white relative" >
                                                    <p class="text-black dark:text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                    <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">`+ chatMessage.c_reply_message + `</p>
                                                    </a>
                                                            `: (chatMessage.c_reply_image.length > 0 ? `
                                                            <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="w-full px-5 py-2 bg-[#222d38] rounded-t-xl border-l-2 border-white relative flex justify-between" >
                                                        <div class="w-full">
                                                            <p class="text-black dark:text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                            <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">Image</p>
                                                        </div>
                                                        <div class="w-fit">
                                                            <img class="max-w-28 max-h-20 rounded-md" src="img/chatImage/`+ chatMessage.c_reply_image + `" alt="">
                                                        </div>
                                                    </a>`: ``)) : ``)}
                                                </div>
                                                ${(chatMessage.c_forward.length > 0 ? `<p class="text-xs mb-2 text-gray-600 italic dark:text-gray-400">Forward Message</p>` : '')}
                                                <div class="flex gap-2 flex-col items-end w-full">
                                                    <img class="${(chatMessage.c_replier.length > 0 ? 'rounded-b-2xl' : 'rounded-2xl')} rounded-bl-none max-h-72 shadow-2xl p-0" src="img/chatImage/${chatMessage.c_image}" alt="">
                                                    <div class="${(chatMessage.c_message.length > 30) ? 'justify-end mt-1' : ''} flex gap-1 items-center">
                                                        <div class="flex gap-1 items-center my-[0.05rem]">
                                                            <p class="text-xs">${formattedTime}</p>
                                                            <p id="starMarkSign${chatMessage.c_unique_id}">${(chatMessage.c_star == 1 ? `
                                                                <svg class="w-[0.80rem] h-[0.80rem]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="#FFB636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" />
                                                                    <path fill="#FFD469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5c-1.6.2-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4c.2 1.6 1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6c1 1.3 2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" />
                                                                </svg>` : '')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="chat${chatMessage.c_unique_id}" class="hidden text-gray-600 relative justify-between items-center min-w-fit select-none rounded-lg">
                                                <input type="checkbox" name="" id="toggleChatMenu${chatMessage.c_unique_id}" class="peer hidden outline-none">
                                                <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                                <label for="toggleChatMenu${chatMessage.c_unique_id}" class="cursor-pointer top-0 left-0 h-full">
                                                    <svg class="w-8 h-8 fill-gray-700 dark:fill-gray-300 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                                                </label>
                                                <ul class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-0 left-full w-40 bg-gray-200 dark:bg-gray-800 shadow-xl bg-opacity-100 rounded-2xl overflow-hidden py-2 px-1">
                                                    <li onclick="messageReply(${chatMessage.c_unique_id},'Friend','Image','${chatMessage.c_image}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Reply</li>
                                                    <a href="img/chatImage/${chatMessage.c_image}"  target="_blank" class="flex items-center text-white fill-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                        <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                                                            <path d="M24 36c11.046 0 20-12 20-12s-8.954-12-20-12S4 24 4 24s8.954 12 20 12Z"/>
                                                            <path d="M24 29a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"/>
                                                        </g>
                                                    </svg> Open</a>
                                                    <li onclick="messageForward('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="transform: rotateY(180deg);">
                                                            <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                        </svg> Forward</li>
                                                    <a href="img/chatImage/${chatMessage.c_image}" download="${chatMessage.c_image}" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                        <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M14.31 16.38L13 17.64V12a1 1 0 0 0-2 0v5.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 21a1 1 0 0 0 .69-.28l3-2.9a1 1 0 1 0-1.38-1.44"/>
                                                            <path fill="currentColor" d="M17.67 7A6 6 0 0 0 6.33 7a5 5 0 0 0-3.08 8.27A1 1 0 1 0 4.75 14A3 3 0 0 1 7 9h.1a1 1 0 0 0 1-.8a4 4 0 0 1 7.84 0a1 1 0 0 0 1 .8H17a3 3 0 0 1 2.25 5a1 1 0 0 0 .09 1.42a1 1 0 0 0 .66.25a1 1 0 0 0 .75-.34A5 5 0 0 0 17.67 7"/>
                                                        </svg> Download</a>
                                                    <li id="starMark${chatMessage.c_unique_id}" ${(chatMessage.c_star == 1 ? 'onclick="starMarkRemoveFromMessage(' + chatMessage.c_unique_id + ')"' : 'onclick="starMarkMessage(' + chatMessage.c_unique_id + ')"')} class="flex items-center capitalize text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                        ${(chatMessage.c_star == 1 ? `<svg class="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0" />
                                                        </svg>` : `<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z" />
                                                        </svg>`)} ${(chatMessage.c_star == 1 ? 'UnStar' : 'Star')}</li>
                                                    <li onclick="singleMessageDelete('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1" />
                                                        </svg> Delete</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    `;
                            } else {
                                htmlContent += `
                                <div id="fullMessageContainer${chatMessage.c_unique_id}" onmouseenter="document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'flex';" onmouseleave="(document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ?document.addEventListener('click', () => (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}') ? (document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').checked ? document.getElementById('toggleChatMenu${chatMessage.c_unique_id}').click() : ''):'' )) :document.getElementById('chat${chatMessage.c_unique_id}').style.display = 'none')" class="w-full p-3 flex justify-end items-center">
                                    <div id="chat${chatMessage.c_unique_id}" class="hidden text-gray-600 relative justify-between items-center min-w-fit select-none rounded-lg">
                                        <input type="checkbox" name="" id="toggleChatMenu${chatMessage.c_unique_id}" class="peer hidden outline-none">
                                        <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                        <label for="toggleChatMenu${chatMessage.c_unique_id}" class="cursor-pointer top-0 left-0 h-full">
                                            <svg class="w-8 h-8 fill-gray-700 dark:fill-gray-300 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                                        </label>
                                        <ul class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-0 right-full w-40 bg-gray-200 dark:bg-gray-800 shadow-xl bg-opacity-100 rounded-2xl overflow-hidden py-2 px-1">
                                            <li onclick="messageReply(${chatMessage.c_unique_id},'You','Image','${chatMessage.c_image}')"  class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                </svg> Reply</li>
                                            <a href="img/chatImage/${chatMessage.c_image}" target="_blank" class="flex items-center text-white fill-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                                                    <path d="M24 36c11.046 0 20-12 20-12s-8.954-12-20-12S4 24 4 24s8.954 12 20 12Z"/>
                                                    <path d="M24 29a5 5 0 1 0 0-10a5 5 0 0 0 0 10Z"/>
                                                </g>
                                            </svg> Open</a>
                                            <li onclick="messageForward('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="transform: rotateY(180deg);">
                                                    <path fill="currentColor" d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822c.984.624 1.99 1.76 2.595 3.876c-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306a7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271c1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66c-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
                                                </svg> Forward</li>
                                            <a href="img/chatImage/${chatMessage.c_image}" download="${chatMessage.c_image}" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                <svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor" d="M14.31 16.38L13 17.64V12a1 1 0 0 0-2 0v5.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3A1 1 0 0 0 12 21a1 1 0 0 0 .69-.28l3-2.9a1 1 0 1 0-1.38-1.44"/>
                                                    <path fill="currentColor" d="M17.67 7A6 6 0 0 0 6.33 7a5 5 0 0 0-3.08 8.27A1 1 0 1 0 4.75 14A3 3 0 0 1 7 9h.1a1 1 0 0 0 1-.8a4 4 0 0 1 7.84 0a1 1 0 0 0 1 .8H17a3 3 0 0 1 2.25 5a1 1 0 0 0 .09 1.42a1 1 0 0 0 .66.25a1 1 0 0 0 .75-.34A5 5 0 0 0 17.67 7"/>
                                                </svg> Download</a>
                                            <li id="starMark${chatMessage.c_unique_id}" ${(chatMessage.c_star == 1 ? 'onclick="starMarkRemoveFromMessage(' + chatMessage.c_unique_id + ')"' : 'onclick="starMarkMessage(' + chatMessage.c_unique_id + ')"')} class="flex items-center capitalize text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md">
                                                ${(chatMessage.c_star == 1 ? `<svg class="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor" d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0" />
                                                </svg>` : `<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z" />
                                                </svg>`)} ${(chatMessage.c_star == 1 ? 'UnStar' : 'Star')}</li>
                                            <li onclick="singleMessageDelete('${chatMessage.c_unique_id}')" class="flex items-center text-white gap-3 p-3 cursor-pointer bg-transparent hover:bg-gray-700 rounded-md"><svg class="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1" /></svg> Delete</li>
                                        </ul>
                                    </div>
                                    <div class="max-w-[50%] w-fit mb-2">
                                    <div class="${(chatMessage.c_replier.length > 0 ? 'bg-black dark:bg-white rounded-t-xl p-1 pb-0' : '')}">
                                            ${(chatMessage.c_replier.length > 0 ? (chatMessage.c_reply_message.length > 0 ? `
                                                                <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="block w-full px-5 py-2 dark:bg-[#dcdcdc] bg-[#222d38] rounded-t-xl border-l-2 dark:border-black border-white relative" >
                                                    <p class="dark:text-black text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                    <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">`+ chatMessage.c_reply_message + `</p>
                                                    </a>
                                                            `: (chatMessage.c_reply_image.length > 0 ? `
                                                            <a href="#fullMessageContainer`+ chatMessage.c_replying_message + `" class="w-full px-5 py-2 dark:bg-[#dcdcdc] bg-[#222d38] rounded-t-xl border-l-2 dark:border-black border-white relative flex justify-between" >
                                                        <div class="w-full">
                                                            <p class="dark:text-black text-white text-sm">`+ (chatMessage.c_replier === userUnique ? 'Friend' : 'You') + `</p>
                                                            <p class="dark:text-gray-700 mt-2 text-gray-500 text-xs truncate overflow-hidden">Image</p>
                                                        </div>
                                                        <div class="w-fit">
                                                            <img class="max-w-28 max-h-10 rounded-md" src="img/chatImage/`+ chatMessage.c_reply_image + `" alt="">
                                                        </div>
                                                    </a>`: ``)) : ``)}
                                                    </div>
                                        ${(chatMessage.c_forward.length > 0 ? `<p class="text-xs mb-2 text-gray-600 italic dark:text-gray-400">Forward Message</p>` : '')}
                                        <div id="chatMessage${chatMessage.c_unique_id}" class="break-all hyphens-auto  p-0 bg-transparent text-black dark:text-white flex gap-2 flex-col items-end">
                                            <img class="${(chatMessage.c_replier.length > 0 ? 'rounded-b-2xl' : 'rounded-2xl')} rounded-br-none max-h-72 shadow-2xl p-0" src="img/chatImage/${chatMessage.c_image}" alt="">
                                            <div class="flex gap-1 items-center my-[0.05rem]">
                                                <p id="formattedTime${chatMessage.c_unique_id}" class="text-xs">${formattedTime}</p>
                                                <p id="starMarkSign${chatMessage.c_unique_id}">${(chatMessage.c_star == 1 ? `<svg class="w-[0.80rem] h-[0.80rem]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="#FFB636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1" />
                                                        <path fill="#FFD469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5c-1.6.2-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4c.2 1.6 1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6c1 1.3 2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7" />
                                                    </svg>` : '')}</p>
                                                ${((chatMessage.c_seen == 1) ? `<svg class="w-[0.80rem] h-[0.80rem] fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                                                </svg>`: ((chatMessage.c_reached == 1) ? `<svg class="w-[0.80rem] h-[0.80rem] fill-gray-400 dark:fill-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm51.3 163.3l-41.9-33C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5zm-88-69.3L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8z" />
                                                </svg>`: ``))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    `;
                            }
                        } else {
                            if (chatMessage.c_sender == userUnique) {
                                htmlContent += `<div id="fullMessageContainer${chatMessage.c_unique_id}" class="w-full p-3 flex justify-start items-end gap-2">
                                                    <img class="w-10 h-10 -mb-3 rounded-full object-cover" src="img/avatar/${friendAvatar}" alt="">
                                                    <div id="chatMessage${chatMessage.c_unique_id}" class="chat max-w-[50%] rounded-2xl rounded-bl-none break-all hyphens-auto p-2 px-4 bg-gray-100 dark:bg-black text-black dark:text-white flex items-end gap-2">
                                                        <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" stroke="currentColor" stroke-width="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <path d="M5 19L19 5" />
                                                            </g>
                                                        </svg>
                                                        <p id="chatMessageText${chatMessage.c_unique_id}" class="italic text-xs">This message has been removed</p>
                                                        <div class="flex gap-1 items-center ml-4 -mb-1">
                                                            <p class="text-[0.7rem] text-gray-600 dark:text-gray-400">${formattedTime}</p>
                                                        </div>
                                                    </div>
                                                </div>`;
                            } else {
                                htmlContent += `<div id="fullMessageContainer${chatMessage.c_unique_id}" class="w-full p-3 flex justify-end items-center">
                                                    <div id="chatMessage${chatMessage.c_unique_id}" class="chat max-w-[50%] duration-300 rounded-2xl rounded-br-none shadow-2xl break-all hyphens-auto p-2 px-4 bg-black dark:bg-white text-white dark:text-gray-700 flex items-end gap-2">
                                                        <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <g fill="none" stroke="currentColor" stroke-width="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <path d="M5 19L19 5" />
                                                            </g>
                                                        </svg>
                                                        <p id="chatMessageText${chatMessage.c_unique_id}" class="italic text-xs">This message has been removed</p>
                                                        <div class="flex gap-1 items-center ml-2">
                                                            <p class="text-[0.7rem] text-gray-400 dark:text-gray-600">${formattedTime}</p>
                                                        </div>
                                                    </div>
                                                </div>`;
                            }
                        }
                    });
                });
                // console.log(htmlContent);
                // Set the HTML content once after building
                allChat.innerHTML = htmlContent;
                htmlContent = "";

                // console.log(allChat.innerHTML);

                setTimeout(() => {
                    allChat.scrollTop = allChat.scrollHeight;


                    chatContainer.addEventListener('scroll', toggleChatBottomVisibility);
                    toggleChatBottomVisibility();

                }, 100);

                // console.log("this is running --------------------------------------");

            } else {
                // console.error("Failed to fetch chat messages");

                // UPDATE STATUS
                updateStatus(data.userStatus);
            }
        },
    });
}

function updateStatus(userStatus) {
    switch (userStatus) {
        case "Online":
            setStatus('Online', 'text-green-600');
            break;
        case "Offline":
            setStatus('Offline', 'text-red-600');
            break;
        case "Typing...":
            setStatus('Typing...', 'text-green-500');
            break;
        default:
            setStatus('', 'text-gray-500');
    }
}

function setStatus(statusText, textColorClass) {
    document.getElementById("chattingPersonProfileStatus").innerHTML = `<span class="text-sm mt-1 ${textColorClass} capitalize">${statusText}</span>`;
    document.getElementById("personProfileStatus").innerHTML = `<span class="text-sm mt-1 ${textColorClass} capitalize">${statusText}</span>`;
}

function getFormattedDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDate(date, today)) {
        return 'Today';
    } else if (isSameDate(date, yesterday)) {
        return 'Yesterday';
    } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const options = { day: 'numeric', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        // Check if the year is the same as the current year
        const showYear = date.getFullYear() !== currentYear;

        // Concatenate the formatted date with the year if needed
        return showYear ? `${formattedDate}, ${date.getFullYear()}` : formattedDate;
    }
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// FETCH ALL CHAT END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// ADD NEW MESSAGE START //////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// PERFORM EVENTS ON TYPING MESSAGE

function messageInput(event) {
    let message = document.getElementById("message");

    console.log("enter");
    if (event.key === "Enter") {
        newMessage();
    }

    // SET STATUS TYPING

    if (message.value.length > 1) {
        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                typing: 'typing',
                user_unique: userUnique,
            },
            success: function (response) {
                console.log(response);
            },
        });
    }
};


// SEND MESSAGE BUTTON
function sendMessage() {
    newMessage();
}

// SEND MESSAGE
function newMessage() {
    let message = document.getElementById("message");

    console.log(message.value);
    console.log("run");

    if (message.value.trim().length > 0) {
        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                online: 'online',
            },
            success: function (response) {
                console.log(response);
            },
        });

        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                sendChats: 'sendChats',
                message: message.value,
                user_unique: userUnique,
            },
            success: function (response) {
                console.log(response);
                const data = JSON.parse(response);
                message.value = "";
                if (data.status === "Success") {
                    fetchChat();
                } else if (data.status === "Error") {
                    if (data.message === "You are not friends with the target user.") {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are not friends with the target user.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    } else if (data.message === "Target user does not have you as a friend.") {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Target user does not have you as a friend.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    } else {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    }
                } else {
                    console.error("Failed to send a new message");
                }
            },
        });
    }
}
/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// ADD NEW MESSAGE END ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Send Image Message START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function imageMessage() {
    let previousImage = null;

    document.getElementById('imageInput').addEventListener("click", () => {
        runSameImage()
    });
    document.getElementById('imageInput').addEventListener('change', previewImage);

    function previewImage() {
        const imageInput = this;
        const toggleImagePreview = document.getElementById('toggleImagePreview');
        const imagePreview = document.getElementById('imagePreview');
        if (imageInput.files && imageInput.files[0]) {
            const currentImage = imageInput.files[0];
            if (previousImage !== currentImage) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result
                };
                reader.readAsDataURL(currentImage);
                if (!toggleImagePreview.checked) {
                    toggleImagePreview.click()
                }
            }
        }
    }

    function runSameImage() {
        const imageInput = document.getElementById('imageInput');
        const currentImage = imageInput.files[0];
        if (currentImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = e.target.result
            };
            reader.readAsDataURL(currentImage)
        }
    }

    document.getElementById("sendImageButton").addEventListener("click", () => {
        const imageInput = document.getElementById('imageInput');
        console.log(document.getElementById('imageInput').files[0]);
        if (imageInput.files && imageInput.files[0]) {

            const formData = new FormData();
            formData.append("sendImage", "sendImage");
            formData.append("user_unique", userUnique);
            formData.append('Image', document.getElementById('imageInput').files[0]);
            console.log([...formData.entries()]);

            $.ajax({
                type: "POST",
                url: "php/backend-index.php",
                data: {
                    online: 'online',
                },
                success: function (response) {
                    console.log(response);
                },
            });

            $.ajax({
                url: 'php/backend-index.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response);
                    toggleImagePreview.click()
                    const data = JSON.parse(response);
                    if (data.status === "Success") {
                        fetchChat();
                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                        document.getElementById('imageInput').value = null;


                    } else if (data.status === "Error") {
                        if (data.message === "You are not friends with the target user.") {
                            allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are not friends with the target user.</p>
                        </div>
                    </div>`;

                            setTimeout(() => {
                                // Scroll to the bottom
                                allChat.scrollTop = allChat.scrollHeight;
                            }, 200);

                        } else if (data.message === "Target user does not have you as a friend.") {
                            allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Target user does not have you as a friend.</p>
                        </div>
                    </div>`;

                            setTimeout(() => {
                                // Scroll to the bottom
                                allChat.scrollTop = allChat.scrollHeight;
                            }, 200);

                        } else {
                            allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                            setTimeout(() => {
                                // Scroll to the bottom
                                allChat.scrollTop = allChat.scrollHeight;
                            }, 200);

                        }
                    } else {
                        console.error("Failed to send a new message");
                    }
                },
                error: function (error) {
                    console.error(error);
                }
            });
        } else {
            console.error("No image selected.")
        }
    })
}


function removeImagePreview() {
    console.log('hello');
    toggleImagePreview.click()
    document.getElementById('imageInput').value = null;
    setTimeout(() => {
        document.getElementById('imagePreview').src = "";
    }, 1000);
}


/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Send Image Message END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
///////////////// UPDATE ONLINE STATUS IN EVERY 5 SECONDS START /////////////////
/////////////////////////////////////////////////////////////////////////////////


setInterval(() => {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            online: 'online',
        },
        success: function (response) {
            console.log(response);
        },
    });
}, 5000);


/////////////////////////////////////////////////////////////////////////////////
///////////////// UPDATE ONLINE STATUS IN EVERY 5 SECONDS END ///////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// BLOCK USER START ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function blockUser() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            block: 'block',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                document.getElementById('BlockModal').style.display = 'none';

                clearInterval(intervalId);
                allChat.innerHTML = "";
                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Blocked by You</p>
                        </div>
                    </div>`;
                allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                blocked = true;

                document.getElementById("sendingMessage").innerHTML = "";

                document.getElementById("personProfileUnfriend").style.display = "block";
                document.getElementById("personProfileFriend").style.display = "none";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                document.getElementById("chattingPersonProfileFriend").style.display = "none";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";


                document.getElementById("personProfileBlockButton").style.background = "#888888";
                document.getElementById("personProfileBlockButton").style.fill = "white";


                setTimeout(() => {
                    allChat.scrollTop = allChat.scrollHeight;

                }, 200);

                blocked = true;

                document.getElementById("personProfileBlockButton").style.background = "#888888";
                document.getElementById("personProfileBlockButton").style.fill = "white";


                document.getElementById("chattingPersonProfileBlockedUser").style.display = "block";
                document.getElementById("personProfileBlockedUser").style.display = "block";
                document.getElementById("personProfileUnfriend").style.display = "none";
                document.getElementById("personProfileFriend").style.display = "none";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                document.getElementById("chattingPersonProfileFriend").style.display = "none";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";
            }
        },
    });
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// BLOCK USER END ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////






document.getElementById("personProfileBlockButton").addEventListener("click", () => {
    if (blocked) {
        document.getElementById('unblockModal').style.display = 'flex'
    } else {
        document.getElementById('BlockModal').style.display = 'flex'
    }
})


document.getElementById("chattingPersonProfileBlockButton").addEventListener("click", () => {
    if (blocked) {
        document.getElementById('unblockModal').style.display = 'flex'
    } else {
        document.getElementById('BlockModal').style.display = 'flex'
    }
})





/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UNBLOCK USER START //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function unblockUser() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            unblock: 'unblock',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                document.getElementById('BlockModal').style.display = 'none';

                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Unblocked</p>
                        </div>
                    </div>`;
                allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Now if you want to chat then make him a friend.</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);

                setTimeout(() => {
                    fetchChat();
                    intervalId = setInterval(fetchChat, 500);
                }, 100);

                document.getElementById("sendingMessage").innerHTML = "";

                blocked = false;

                document.getElementById("personProfileBlockButton").style.background = "transparent";
                document.getElementById("personProfileBlockButton").style.fill = "#9ca3af";


                document.getElementById("chattingPersonProfileBlockedUser").style.display = "none";
                document.getElementById("personProfileBlockedUser").style.display = "none";
                document.getElementById("personProfileUnfriend").style.display = "block";
                document.getElementById("personProfileFriend").style.display = "none";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                document.getElementById("chattingPersonProfileFriend").style.display = "none";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";
            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UNBLOCK USER END ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REPORT USER START ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function reportUser() {
    let reportUserText = document.getElementById("reportUserText");
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            report: 'report',
            user_unique: userUnique,
            reportUserText: reportUserText.value,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                reported = true;
                document.getElementById('reportModal').style.display = 'none';
                document.getElementById('reportUserText').value = '';

                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Reported</p>
                        </div>
                    </div>`;
                allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Report Successfully Submitted</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);


                document.getElementById("personProfileReportButton").style.background = "#888888";
                document.getElementById("personProfileReportButton").style.fill = "white";
            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REPORT USER END /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////





document.getElementById("personProfileReportButton").addEventListener("click", () => {
    if (reported) {
        document.getElementById('removeReportModal').style.display = 'flex'
    } else {
        document.getElementById('reportModal').style.display = 'flex'
    }
})


document.getElementById("chattingPersonProfileReportButton").addEventListener("click", () => {
    if (reported) {
        document.getElementById('removeReportModal').style.display = 'flex'
    } else {
        document.getElementById('reportModal').style.display = 'flex'
    }
})





/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REMOVE REPORT START /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function removeReport() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            removeReport: 'removeReport',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                reported = false;
                document.getElementById('removeReportModal').style.display = 'none';

                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Report Removed</p>
                        </div>
                    </div>`;
                allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Report remove Successfully</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);


                document.getElementById("personProfileReportButton").style.background = "transparent";
                document.getElementById("personProfileReportButton").style.fill = "#9ca3af";
            }
        },
    });
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REMOVE REPORT END ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// NOTIFICATION OFF START /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function notification() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            manageNotification: 'manageNotification',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                if (data.action === "removed") {
                    document.getElementById("chattingPersonProfileMute").style.background = "transparent";
                    document.getElementById("personProfileMuteButton").style.background = "transparent";
                    document.getElementById("chattingPersonProfileMute").style.fill = "#9ca3af";
                    document.getElementById("personProfileMuteButton").style.fill = "#9ca3af";
                } else if (data.action === "added") {
                    document.getElementById("chattingPersonProfileMute").style.background = "#888888";
                    document.getElementById("personProfileMuteButton").style.background = "#888888";
                    document.getElementById("chattingPersonProfileMute").style.fill = "white";
                    document.getElementById("personProfileMuteButton").style.fill = "white";
                }
            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// NOTIFICATION OFF END ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// SEARCH USERS START //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

let friendNameSearchInput = document.getElementById("friendNameSearchInput");
let friendNameSearchButton = document.getElementById("friendNameSearchButton");

friendNameSearchInput.addEventListener("input", () => {
    console.log("run");
    let value = friendNameSearchInput.value
        .replace(/\s/g, "")
        .replace(/\.com$/i, "")
        .replace(/[^\w\s]/gi, "");
    friendNameSearchInput.value = value.toLowerCase();


    searchFriendName();
})
friendNameSearchButton.addEventListener("click", () => {
    searchFriendName();
})


const oldData = friendList.innerHTML;
function searchFriendName() {

    if (friendNameSearchInput.value.length > 2) {
        let friendList = document.getElementById("friendList");

        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                searchFriend: 'searchFriend',
                searchInput: friendNameSearchInput.value,
            },
            success: function (response) {
                try {
                    const details = JSON.parse(response);

                    if (details.data && details.data.length > 0) {
                        let UsersContent = '';

                        details.data.forEach(fetchedUsers => {
                            UsersContent += `<div onclick="startChat(${fetchedUsers.user_unique})" class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                <div class="flex items-center gap-3 w-full p-2">
                                    <img class="w-10 h-10 rounded-full" src="img/avatar/${fetchedUsers.avatar}" alt="">
                                    <div class="w-full overflow-hidden">
                                        <div class="flex justify-between gap-1 w-full">
                                            <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">${fetchedUsers.name}</h3>
                                        </div>
                                        <div class="rounded-full p-1 w-full overflow-hidden">
                                            <p class="text-gray-400 font-medium text-sm dark:text-gray-500 truncate w-full overflow-hidden">${fetchedUsers.userName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        });

                        friendList.innerHTML = UsersContent + `<div class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                <div class="flex items-center gap-3 w-full p-2">
                                    <div class="w-full overflow-hidden">
                                        <div class="flex justify-between gap-1 w-full">
                                            <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Friends</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>` + oldData;
                    } else {
                        friendList.innerHTML = `<div class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                <div class="flex items-center gap-3 w-full p-2">
                                    <div class="w-full overflow-hidden">
                                        <div class="flex justify-center gap-1 w-full">
                                            <h3 class="text-gray-600 font-medium capitalize text-sm text-center truncate dark:text-gray-400">No User Found</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                <div class="flex items-center gap-3 w-full p-2">
                                    <div class="w-full overflow-hidden">
                                        <div class="flex justify-between gap-1 w-full">
                                            <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Friends</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>` + oldData;
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    // Handle the error, e.g., display an error message to the user
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
                // Handle the error, e.g., display an error message to the user
            }
        });
    } else {
        friendList.innerHTML = `<div class="p-2 pr-5 w-full flex items-center justify-between gap-10 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                                <div class="flex items-center gap-3 w-full p-2">
                                    <div class="w-full overflow-hidden">
                                        <div class="flex justify-between gap-1 w-full">
                                            <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">Friends</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>` + oldData;
    }
}

// Use input event and debounce for a better user experience
friendNameSearchInput.addEventListener('input', debounce(searchFriendName, 300));

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
    };
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// SEARCH USERS END ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SCROLL CHAT BOTTOM START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

document.getElementById("chatBottom").addEventListener("click", () => {
    allChat.scrollTop = allChat.scrollHeight;
})

const chatContainer = document.getElementById('allChat');
const chatBottom = document.getElementById('chatBottom');

function isUserAtBottom() {
    // Check if the user is at the bottom of the chat container
    const isAtBottom = Math.abs(chatContainer.scrollHeight - (chatContainer.scrollTop + chatContainer.clientHeight)) <= 5;
    return isAtBottom;
}
function toggleChatBottomVisibility() {
    if (isUserAtBottom()) {
        chatBottom.style.display = 'none';
    } else {
        chatBottom.style.display = 'flex';
    }
}


/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SCROLL CHAT BOTTOM END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// OPEN MENU START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////


document.addEventListener("click", (event) => {
    const targetElement = event.target;
    const chattingPersonProfileMenu = document.getElementById("chattingPersonProfileMenu");
    const chattingPersonProfileMenuItems = document.getElementById("chattingPersonProfileMenuItems");

    // Check if the clicked element is outside the menu
    if (
        !chattingPersonProfileMenu.contains(targetElement) &&
        !chattingPersonProfileMenuItems.contains(targetElement)
    ) {
        // Close the menu if it is open
        if (chattingPersonProfileMenuItems.style.display === "block") {
            chattingPersonProfileMenuItems.style.opacity = "0";
            setTimeout(() => {
                chattingPersonProfileMenuItems.style.top = "-500%";
                chattingPersonProfileMenuItems.style.display = "none";
            }, 100);
        }
    }
});

// Add your existing click event listener to toggle the menu
let chattingPersonProfileMenu = document.getElementById("chattingPersonProfileMenu");
let chattingPersonProfileMenuItems = document.getElementById("chattingPersonProfileMenuItems");

chattingPersonProfileMenu.addEventListener("click", () => {
    if (chattingPersonProfileMenuItems.style.display === "block") {
        chattingPersonProfileMenuItems.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileMenuItems.style.top = "-500%";
            chattingPersonProfileMenuItems.style.display = "none";
        }, 100);
    } else {
        chattingPersonProfileMenuItems.style.display = "block";
        chattingPersonProfileMenuItems.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileMenuItems.style.top = "100%";
            chattingPersonProfileMenuItems.style.opacity = "1";
        }, 100);
    }
});


/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// OPEN MENU END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// CHAT SEARCH START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

document.addEventListener("click", (event) => {
    const targetElement = event.target;
    const chattingPersonProfileSearchBox = document.getElementById("chattingPersonProfileSearchBox");
    const chattingPersonProfileSearchButton = document.getElementById("chattingPersonProfileSearchButton");
    const chattingPersonProfileOpenSearchBox = document.getElementById("chattingPersonProfileOpenSearchBox");

    // Check if the clicked element is outside the search box and toggle button
    if (
        !chattingPersonProfileSearchBox.contains(targetElement) &&
        !chattingPersonProfileOpenSearchBox.contains(targetElement) &&
        !chattingPersonProfileSearchButton.contains(targetElement)
    ) {
        // Close the search box if it is open
        if (chattingPersonProfileSearchBox.style.display === "flex") {
            chattingPersonProfileSearchBox.style.opacity = "0";
            setTimeout(() => {
                chattingPersonProfileSearchBox.style.display = "none";
            }, 100);
        }
    }
});

let chattingPersonProfileSearchButton = document.getElementById("chattingPersonProfileSearchButton");
let chattingPersonProfileOpenSearchBox = document.getElementById("chattingPersonProfileOpenSearchBox");
let chattingPersonProfileSearchBox = document.getElementById("chattingPersonProfileSearchBox");

chattingPersonProfileSearchButton.addEventListener("click", () => {
    if (chattingPersonProfileSearchBox.style.display === "flex") {
        chattingPersonProfileSearchBox.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileSearchBox.style.display = "none";
        }, 100);
    } else {
        chattingPersonProfileSearchBox.style.display = "flex";
        chattingPersonProfileSearchBox.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileSearchBox.style.opacity = "1";
        }, 100);
    }
});

chattingPersonProfileOpenSearchBox.addEventListener("click", () => {
    if (chattingPersonProfileSearchBox.style.display === "flex") {
        chattingPersonProfileSearchBox.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileSearchBox.style.display = "none";
        }, 100);
    } else {
        chattingPersonProfileSearchBox.style.display = "flex";
        chattingPersonProfileSearchBox.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileSearchBox.style.opacity = "1";
        }, 100);
    }


    const chattingPersonProfileMenuItems = document.getElementById("chattingPersonProfileMenuItems");

    if (chattingPersonProfileMenuItems.style.display === "block") {
        chattingPersonProfileMenuItems.style.opacity = "0";
        setTimeout(() => {
            chattingPersonProfileMenuItems.style.top = "-500%";
            chattingPersonProfileMenuItems.style.display = "none";
        }, 100);
    }
});






document.getElementById("chattingPersonProfileSearchBar").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        chatSearch();
    }
});




// Function to remove search buttons
function removeSearchButtons() {
    let existingButtons = document.querySelectorAll(".search-button");
    existingButtons.forEach(button => button.remove());
    currentTargetIndex = 0; // Reset the target index when removing buttons
}

// Function to create up and down search buttons
function createSearchButtons(middlePosition, matchingPositions) {
    // Create up button
    let upButton = document.createElement("button");
    upButton.innerHTML = `<svg class="w-8 h-8 p-2 rounded-full overflow-hidden fill-black  rotate-180 bg-white shadow-2xl dark:bg-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;
    upButton.classList.add("search-button", "absolute", "top-5", "left-5", "w-fit", "h-fit", "rounded-full");
    upButton.addEventListener("click", () => {
        scrollSearchButtons(-1, matchingPositions);
    });

    // Create down button
    let downButton = document.createElement("button");
    downButton.innerHTML = `<svg class="w-8 h-8 p-2 rounded-full overflow-hidden fill-black bg-white shadow-2xl dark:bg-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;
    downButton.classList.add("search-button", "absolute", "top-10", "left-5", "w-fit", "h-fit", "rounded-full");
    downButton.addEventListener("click", () => {
        scrollSearchButtons(1, matchingPositions);
    });

    // Append buttons to the allChat container
    let allChatMainContainer = document.getElementById("allChatMainContainer");
    allChatMainContainer.appendChild(upButton);
    allChatMainContainer.appendChild(downButton);
}
// Function to scroll search buttons
function scrollSearchButtons(direction, matchingPositions) {
    // Update the current target index based on the direction
    currentTargetIndex += direction;

    // Ensure the target index is within the valid range
    currentTargetIndex = Math.max(0, Math.min(currentTargetIndex, matchingPositions.length + 1));

    // Get the target position based on the current target index
    let targetPosition = matchingPositions[currentTargetIndex];

    // Scroll to the target position with a smooth behavior
    document.getElementById("allChat").scrollTo({ top: targetPosition, behavior: "smooth" });

    // Remove search buttons if the target index is out of bounds
    if (currentTargetIndex < 0 || currentTargetIndex >= matchingPositions.length) {
        removeSearchButtons();
    }
}


// Function to find the last occurrence of the search query
function findLastOccurrence(searchQuery, chatItems) {
    let lastPosition = -1;

    // Loop through chat items to find the last occurrence
    for (let i = 0; i < chatItems.length; i++) {
        let chatItem = chatItems[i];
        let chatContent = chatItem.innerText.toLowerCase();

        // Check if the chat content contains the search query
        if (chatContent.includes(searchQuery)) {
            lastPosition = chatItem.offsetTop;
        }
    }

    return lastPosition;
}

// Function to handle chat search
function chatSearch() {
    console.log("it's running");
    // Get the search bar and all chat elements
    let chattingPersonProfileSearchBar = document.getElementById("chattingPersonProfileSearchBar");
    let allChat = document.getElementById("allChat");

    // Get the search query
    let searchQuery = chattingPersonProfileSearchBar.value.toLowerCase();

    // Get all chat items
    let chatItems = allChat.getElementsByClassName("chat");

    // Array to store matching positions
    let matchingPositions = [];

    // Loop through chat items to find and store all matching positions
    for (let i = 0; i < chatItems.length; i++) {
        let chatItem = chatItems[i];
        let chatContent = chatItem.innerText.toLowerCase();

        // Check if the chat content contains the search query
        if (chatContent.includes(searchQuery)) {
            matchingPositions.push(chatItem.offsetTop);

            // Add a class for blinking effect
            chatItem.classList.add("animate-bounce");
            chatItem.classList.add("text-red-500");
            chatItem.classList.add("dark:text-red-500");
        } else {
            // Remove the blinking class from non-matching items
            chatItem.classList.remove("animate-bounce");
            chatItem.classList.remove("text-red-500");
            chatItem.classList.remove("dark:text-red-500");
        }
        chatItem.addEventListener("click", () => {
            // Remove the blinking class from non-matching items
            chatItem.classList.remove("animate-bounce");
            chatItem.classList.remove("text-red-500");
            chatItem.classList.remove("dark:text-red-500");
        });
    }

    // Check if there are matching positions
    if (matchingPositions.length > 0) {
        // Get the last position based on the visible height of the chat container
        let lastPosition = findLastOccurrence(searchQuery, chatItems);

        // Scroll to the last position with a smooth behavior
        document.getElementById("allChat").scrollTo({ top: lastPosition, behavior: "smooth" });

        // Set focus to the search bar
        chattingPersonProfileSearchBar.focus();

        // Remove existing buttons (if any)
        removeSearchButtons();

        // Create up and down buttons
        createSearchButtons(lastPosition, matchingPositions);
    }
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// CHAT SEARCH END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
///////////////////////// ACCEPT FRIEND REQUEST START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function accept() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            acceptFriend: 'acceptFriend',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                document.getElementById("personProfileReportButton").style.background = "transparent";
                document.getElementById("personProfileReportButton").style.fill = "#9ca3af";

                document.getElementById("personProfileUnfriend").style.display = "none";
                document.getElementById("personProfileFriend").style.display = "block";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                document.getElementById("chattingPersonProfileFriend").style.display = "block";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";

                document.getElementById("personProfileFriendRequestButton").style.display = "none";
                document.getElementById("personProfileFriendRequestButton").setAttribute("onclick", "");
                document.getElementById("personProfileFriendRequestButton").id = "";

                document.getElementById("sendingMessage").innerHTML = "";
                document.getElementById("sendingMessage").innerHTML = sendMessageButtonHtml;

                openEmoji();
                imageMessage();

            }
        },
    });
}


/////////////////////////////////////////////////////////////////////////////////
///////////////////////// ACCEPT FRIEND REQUEST END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SEND FRIEND REQUEST START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function sendFriendRequest() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            sendFriendRequest: 'sendFriendRequest',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                document.getElementById("personProfileUnfriend").style.display = "none";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "block";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "none";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "block";

                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Request Send</p>
                        </div>
                    </div>
                    <div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Please wait until he accepts your request.</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);

            } else if (data.status === "Error") {
                if (data.message === "You Blocked this user") {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Target user has been blocked by you.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                } else if (data.message === "This User Blocked You") {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Unfortunately, target user has blocked you.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                } else {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Oops! An error occurred. Please try again later.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                }
            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SEND FRIEND REQUEST END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
///////////////////////// REMOVE FRIEND REQUEST START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function removeFriendRequest() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            removeFriendRequest: 'removeFriendRequest',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                document.getElementById("personProfileUnfriend").style.display = "block";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";

                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Request Removed</p>
                        </div>
                    </div>
                    <div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Your friend request has been successfully withdrawn.</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);
            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
///////////////////////// REMOVE FRIEND REQUEST END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// REMOVE FRIEND START /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function removeFriend() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            removeFriend: 'removeFriend',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);


            if (data.status === "Success") {
                document.getElementById("personProfileReportButton").style.background = "transparent";
                document.getElementById("personProfileReportButton").style.fill = "#9ca3af";

                document.getElementById("personProfileUnfriend").style.display = "block";
                document.getElementById("personProfileFriend").style.display = "none";
                document.getElementById("personProfileFriendRequestSendByYou").style.display = "none";
                document.getElementById("chattingPersonProfileUnfriend").style.display = "block";
                document.getElementById("chattingPersonProfileFriend").style.display = "none";
                document.getElementById("chattingPersonFriendRequestSendByYou").style.display = "none";

                document.getElementById("personProfileImage").style.border = '0px';
                document.getElementById("personTabIsFriend").style.display = 'none';
                document.getElementById("personTabIsFriend").innerText = '';
                document.getElementById("chattingPersonProfileImage").style.border = '0px';
                document.getElementById("chattingPersonIsFriend").style.display = 'none';


                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Unfriend</p>
                        </div>
                    </div>
                    <div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);

                document.getElementById("sendingMessage").innerHTML = "";

            }
        },
    });
}

/////////////////////////////////////////////////////////////////////////////////
////////////////////////////// REMOVE FRIEND END ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
/////////////////// TOGGLE SEND REQUEST'S ACCOUNT START /////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function toggleSendRequest() {
    let allSendRequestAccounts = document.getElementById("allSendRequestAccounts");
    let sendRequestToggleShow = document.getElementById("sendRequestToggleShow");

    if (allSendRequestAccounts.style.display === 'none') {
        allSendRequestAccounts.style.display = 'block';
        sendRequestToggleShow.style.transform = 'rotate(0deg)';
    } else {
        allSendRequestAccounts.style.display = 'none';
        sendRequestToggleShow.style.transform = 'rotate(90deg)';
    }
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////// TOGGLE SEND REQUEST'S ACCOUNT END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
//////////////////////// TOGGLE REQUEST'S ACCOUNT START /////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function toggleRequest() {
    let allRequestAccounts = document.getElementById("allRequestAccounts");
    let requestToggleShow = document.getElementById("requestToggleShow");

    if (allRequestAccounts.style.display === 'none') {
        allRequestAccounts.style.display = 'block';
        requestToggleShow.style.transform = 'rotate(0deg)';
    } else {
        allRequestAccounts.style.display = 'none';
        requestToggleShow.style.transform = 'rotate(90deg)';
    }
}


/////////////////////////////////////////////////////////////////////////////////
//////////////////////// TOGGLE REQUEST'S ACCOUNT END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UPDATE PROFILE START ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


let previousImage = null;

document.getElementById('profileImageInput').addEventListener("click", () => {
    runSameProfileImage()
});
document.getElementById('profileImageInput').addEventListener('change', previewProfileImage);

function previewProfileImage() {
    const profileImageInput = this;
    const profileImagePreview = document.getElementById('profileImagePreview');
    if (profileImageInput.files && profileImageInput.files[0]) {
        const currentImage = profileImageInput.files[0];
        if (previousImage !== currentImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImagePreview.src = e.target.result
            };
            reader.readAsDataURL(currentImage);
        }
    }
}

function runSameProfileImage() {
    const profileImageInput = document.getElementById('profileImageInput');
    const currentImage = profileImageInput.files[0];
    if (currentImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profileImagePreview = document.getElementById('profileImagePreview');
            profileImagePreview.src = e.target.result
        };
        reader.readAsDataURL(currentImage)
    }
}



let submitUpdateProfile = document.getElementById("submitUpdateProfile");

submitUpdateProfile.addEventListener("click", () => {

    if (document.getElementById("fullNameUpdate").value.length > 2 && document.getElementById("userNameUpdate").value.length > 6 && document.getElementById("genderUpdate").value.length > 0) {

        const formData = new FormData();
        formData.append("updateDetails", "updateDetails");
        formData.append('ProfileImage', document.getElementById('profileImageInput').files[0]);
        formData.append("fullNameUpdate", document.getElementById("fullNameUpdate").value);
        formData.append("userNameUpdate", document.getElementById("userNameUpdate").value);
        formData.append("descriptionUpdate", document.getElementById("descriptionUpdate").value);
        formData.append("numberUpdate", document.getElementById("numberUpdate").value);
        formData.append("genderUpdate", document.getElementById("genderUpdate").value);
        formData.append("hobbiesUpdate", document.getElementById("hobbiesUpdate").value);
        console.log([...formData.entries()]);



        $.ajax({
            url: 'php/backend-index.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
                const data = JSON.parse(response);
                if (data.status === "Success") {

                    document.getElementById('profileModal').style.display = 'none';

                    location.reload();

                } else if (data.status === "Error" || data.message === 'UserNameFound') {
                    alert('Oops! Username already taken. Please choose an alternative.')
                } else {
                    console.error("Failed to send a new message");
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    } else {
        alert("Do not leave full name and username blank")
    }
})

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// UPDATE PROFILE END //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// CLEAR ALL CHAT START //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function clearAllChat() {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            clearAllChat: 'clearAllChat',
            user_unique: userUnique,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {
                oldMessage = [11111];
                messagesByDate = {};
                allChat.innerHTML = "";
                allChat.innerHTML += `<div class="w-full p-3 mt-20 select-none flex justify-center items-center">
                        <div class="flex items-center justify-center">
                            <p class="rounded-md py-1 px-4 bg-transparent text-black dark:text-white">Chat cleared</p>
                        </div>
                    </div>`;
                fetchChat();


                setTimeout(() => {
                    // Scroll to the bottom
                    allChat.scrollTop = allChat.scrollHeight;
                }, 200);
            }
        },
    });
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// CLEAR ALL CHAT END //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// COPY MESSAGE START //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////



function copyTextAndScale(elementId) {
    const chatMessage = document.getElementById('chatMessage' + elementId);
    const chatMessageText = document.getElementById('chatMessageText' + elementId);

    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = chatMessageText.innerText;

    // Append the input element to the document
    document.body.appendChild(tempInput);

    // Select the text in the input element
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Apply scaling effect
    chatMessage.style.transform = 'scale(1.1)';
    setTimeout(() => {
        chatMessage.style.transform = 'scale(1)';
    }, 500);
}



/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// COPY MESSAGE END ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
///////////////////////// SINGLE MESSAGE DELETE START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////




function singleMessageDelete(messageId) {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            singleMessageDelete: 'singleMessageDelete',
            messageId: messageId,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {

                if (data.messageOwner === "Sender") {
                    const fullMessageContainer = document.getElementById('fullMessageContainer' + messageId);

                    console.log(fullMessageContainer);

                    formattedTime = document.getElementById('formattedTime' + messageId).innerText;
                    fullMessageContainer.removeAttribute("onmouseenter");
                    fullMessageContainer.removeAttribute("onmouseleave");
                    fullMessageContainer.innerHTML = "";
                    console.log(fullMessageContainer.innerHTML);
                    fullMessageContainer.innerHTML = `<div id="chatMessage${messageId}" class="chat max-w-[50%] duration-300 rounded-2xl rounded-br-none shadow-2xl break-all hyphens-auto p-2 px-4 bg-black dark:bg-white text-white dark:text-gray-700 flex items-end gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M5 19L19 5" />
                                </g>
                            </svg>
                            <p id="chatMessageText${messageId}" class="italic text-xs">This message has been removed</p>
                            <div class="flex gap-1 items-center ml-2">
                                <p class="text-[0.7rem] text-gray-400 dark:text-gray-600">${formattedTime}</p>
                            </div>
                    </div>`;
                } else if (data.messageOwner === "Receiver") {
                    const fullMessageContainer = document.getElementById('fullMessageContainer' + messageId);

                    console.log(fullMessageContainer);

                    formattedTime = document.getElementById('formattedTime' + messageId).innerText;
                    fullMessageContainer.removeAttribute("onmouseenter");
                    fullMessageContainer.removeAttribute("onmouseleave");
                    fullMessageContainer.innerHTML = "";
                    console.log(fullMessageContainer.innerHTML);
                    fullMessageContainer.innerHTML = `<div id="fullMessageContainer${messageId}" class="w-full p-3 flex justify-start items-end gap-2">
                        <img class="w-10 h-10 -mb-3 rounded-full object-cover" src="img/avatar/${friendAvatar}" alt="">
                        <div id="chatMessage${messageId}" class="chat max-w-[50%] rounded-2xl rounded-bl-none break-all hyphens-auto p-2 px-4 bg-gray-100 dark:bg-black text-black dark:text-white flex items-end gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M5 19L19 5" />
                                </g>
                            </svg>
                            <p id="chatMessageText${messageId}" class="italic text-xs">This message has been removed</p>
                            <div class="flex gap-1 items-center ml-4 -mb-1">
                                <p class="text-[0.7rem] text-gray-600 dark:text-gray-400">${formattedTime}</p>
                            </div>
                        </div>
                    </div>`;
                } else {
                    if (confirm("Something went wrong! Please refresh the page")) {
                        location.reload();
                    }
                }
            }
        },
    });
}



/////////////////////////////////////////////////////////////////////////////////
///////////////////////// SINGLE MESSAGE DELETE END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// STAR MARK MESSAGE START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////




function starMarkMessage(messageId) {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            starMarkMessage: 'starMarkMessage',
            messageId: messageId,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {

                const starMark = document.getElementById('starMark' + messageId);
                const starMarkSign = document.getElementById('starMarkSign' + messageId);

                starMark.setAttribute("onclick", "starMarkRemoveFromMessage(" + messageId + ")")

                starMark.innerHTML = `<svg class="w-5 h-5" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M259.3 17.8L194 150.2L47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103l-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5l105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2L316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0" />
                </svg> UnStar`;

                starMarkSign.innerHTML = `<svg class="w-[0.80rem] h-[0.80rem]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#FFB636" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1"/>
                                                <path fill="#FFD469" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5c-1.6.2-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4c.2 1.6 1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6c1 1.3 2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7"/>
                                            </svg>`;
            }
        },
    });
}



/////////////////////////////////////////////////////////////////////////////////
///////////////////////////// STAR MARK MESSAGE END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////////////////////
///////////////// STAR MARK REMOVE FROM MESSAGE START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////




function starMarkRemoveFromMessage(messageId) {
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            starMarkRemoveFromMessage: 'starMarkRemoveFromMessage',
            messageId: messageId,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {


                const starMark = document.getElementById('starMark' + messageId);
                const starMarkSign = document.getElementById('starMarkSign' + messageId);


                starMark.setAttribute("onclick", "starMarkMessage(" + messageId + ")")
                starMark.innerHTML = `<svg class="w-5 h-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor" d="m512 747.84l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08l184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256l99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96l221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z" />
                                    </svg> Star`;

                starMarkSign.innerHTML = "";
            }
        },
    });
}



/////////////////////////////////////////////////////////////////////////////////
///////////////// STAR MARK REMOVE FROM MESSAGE END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// OPEN EMOJI CONTAINER END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function openReplyEmoji() {
    const picker = new EmojiMart.Picker({
        // Reference the input element
        target: document.querySelector('#message'),

        icons: 'outline',
        locale: 'en',
        navPosition: 'top',
        previewPosition: 'none',
        searchPosition: 'top',
        skinTonePosition: 'search',
        set: 'google',
        perLine: 6,
        noCountryFlags: true,
        maxFrequentRows: 6,
        autoFocus: true,
        emojiSize: 40,
        emojiButtonSize: 50,
        dynamicWidth: true,

        onEmojiSelect: (emoji) => {
            insertEmojiIntoInput(emoji.native);
        }
    });

    function insertEmojiIntoInput(emoji) {
        const input = document.querySelector('#replyMessage');
        const cursorPosition = input.selectionStart;
        const textBeforeCursor = input.value.substring(0, cursorPosition);
        const textAfterCursor = input.value.substring(cursorPosition);

        input.value = textBeforeCursor + emoji + textAfterCursor;

        // Move the cursor to the end of the inserted emoji
        input.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);

        // Trigger the input event to update any event listeners or bindings
        input.dispatchEvent(new Event('input'));

        // Set focus back to the input
        input.focus();

        // Hide EmojiContainer after selecting an emoji
        document.getElementById("toggleReplyEmojiSection").click();
    }

    // Append the picker to the EmojiContainer
    document.getElementById("replyEmojiContainer").appendChild(picker);

    // Toggle EmojiContainer visibility on checkbox change
    document.getElementById('toggleReplyEmojiSection').addEventListener('change', function () {
        const emojiContainer = document.getElementById("replyEmojiContainer");
        emojiContainer.classList.toggle('invisible', !this.checked);
        emojiContainer.classList.toggle('opacity-0', !this.checked);
    });
}


/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// OPEN EMOJI CONTAINER END ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////








/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// ADD NEW MESSAGE START //////////////////////////
/////////////////////////////////////////////////////////////////////////////////


// PERFORM EVENTS ON TYPING REPLY MESSAGE

function replyMessageInput(event, messageId) {
    let replyMessage = document.getElementById("replyMessage");

    console.log("enter");
    if (event.key === "Enter") {
        sendReplyMessage(messageId);
    }

    // SET STATUS TYPING

    if (replyMessage.value.length > 1) {
        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                typing: 'typing',
                user_unique: userUnique,
            },
            success: function (response) {
                console.log(response);
            },
        });
    }
}

// SEND REPLY MESSAGE BUTTON
function sendReplyMessage(messageId) {
    newReplyMessage(messageId);
}

// SEND REPLY MESSAGE
function newReplyMessage(messageId) {
    let replyMessage = document.getElementById("replyMessage");

    console.log(userUnique);
    console.log("run");

    if (replyMessage.value.trim().length > 0) {
        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                online: 'online',
            },
            success: function (response) {
                console.log(response);
            },
        });

        $.ajax({
            type: "POST",
            url: "php/backend-index.php",
            data: {
                sendReply: 'sendReply',
                messageId: messageId,
                message: replyMessage.value,
                user_unique: userUnique,
            },
            success: function (response) {
                removeReply();
                console.log(response);
                const data = JSON.parse(response);
                replyMessage.value = "";
                if (data.status === "Success") {
                    fetchChat();
                } else if (data.status === "Error") {
                    if (data.message === "You are not friends with the target user.") {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are not friends with the target user.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    } else if (data.message === "Target user does not have you as a friend.") {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Target user does not have you as a friend.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    } else {
                        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                        setTimeout(() => {
                            // Scroll to the bottom
                            allChat.scrollTop = allChat.scrollHeight;
                        }, 200);

                    }
                } else {
                    console.error("Failed to send a new message");
                }
            },
        });
    }
}



/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// ADD NEW MESSAGE END ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Send Image Message START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function replyImageMessage(messageId) {
    // Define variables related to replyImage
    let previousReplyImage = null;
    const replyImageInput = document.getElementById('replyImageInput');
    const toggleReplyImagePreview = document.getElementById('toggleReplyImagePreview');
    const replyImagePreview = document.getElementById('replyImagePreview');
    const sendReplyImageButton = document.getElementById("sendReplyImageButton");

    // Add event listeners for replyImage
    replyImageInput.addEventListener("click", runSameReplyImage);
    replyImageInput.addEventListener('change', previewReplyImage);
    sendReplyImageButton.addEventListener("click", sendReplyImage);

    // Function to preview the selected image
    function previewReplyImage() {
        if (replyImageInput.files && replyImageInput.files[0]) {
            const currentReplyImage = replyImageInput.files[0];
            if (previousReplyImage !== currentReplyImage) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    replyImagePreview.src = e.target.result;
                };
                reader.readAsDataURL(currentReplyImage);
                if (!toggleReplyImagePreview.checked) {
                    toggleReplyImagePreview.click();
                }
            }
        }
    }

    // Function to run the same replyImage
    function runSameReplyImage() {
        const currentReplyImage = replyImageInput.files[0];
        if (currentReplyImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                replyImagePreview.src = e.target.result;
            };
            reader.readAsDataURL(currentReplyImage);
        }
    }

    // Function to send the replyImage
    function sendReplyImage() {
        if (replyImageInput.files && replyImageInput.files[0]) {
            const formData = new FormData();
            formData.append("sendReplyImage", "sendReplyImage");
            formData.append("user_unique", userUnique);
            formData.append("messageId", messageId);
            formData.append('Image', replyImageInput.files[0]);

            // Perform AJAX request to send the replyImage
            $.ajax({
                url: 'php/backend-index.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: handleReplyImageResponse,
                error: function (error) {
                    console.error(error);
                }
            });
        } else {
            console.error("No image selected.");
        }
    }

    // Function to handle the response after sending the replyImage
    function handleReplyImageResponse(response) {
        removeReply();
        console.log(response);
        toggleReplyImagePreview.click();
        const data = JSON.parse(response);

        if (data.status === "Success") {
            fetchChat();
            setTimeout(() => {
                // Scroll to the bottom
                allChat.scrollTop = allChat.scrollHeight;
            }, 200);

            replyImageInput.value = null;
        } else if (data.status === "Error") {
            handleReplyImageError(data.message);
        } else {
            console.error("Failed to send a new message");
        }
    }

    // Function to handle different error scenarios
    function handleReplyImageError(errorMessage) {
        let errorText;

        switch (errorMessage) {
            case "You are not friends with the target user.":
                errorText = "You are not friends with the target user.";
                break;
            case "Target user does not have you as a friend.":
                errorText = "Target user does not have you as a friend.";
                break;
            default:
                errorText = "You are no longer able to send messages.";
                break;
        }

        // Display error message in the chat
        allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
            <div class="w-1/2 flex items-center justify-center">
                <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">${errorText}</p>
            </div>
        </div>`;

        setTimeout(() => {
            // Scroll to the bottom
            allChat.scrollTop = allChat.scrollHeight;
        }, 200);
    }
}

function removeReplyImagePreview() {
    console.log('hello');
    toggleReplyImagePreview.click();
    replyImageInput.value = null;
    setTimeout(() => {
        replyImagePreview.src = "";
    }, 1000);
}



/////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Send Image Message END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// REPLY MESSAGE START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function messageReply(messageId, source, type, content) {
    console.log(content);
    let sendMessageWithReplyHtml = `
                    <div class="w-full absolute bottom-full p-5 py-3 pb-0 bg-[#161d24]" style="box-shadow: 0px -6px 15px 0px #5b5b5b26;">
                    
                    ${(type === 'Text' ? `
                    <div class="w-full px-5 py-2 bg-[#222d38] rounded-xl border-l-2 border-white relative">
                        <svg onclick="removeReply()" class="w-7 h-7 hover:rotate-180 duration-300 absolute right-2 shadow-2xl rounded-full cursor-pointer p-2 bg-black fill-white dark:bg-white dark:fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                            <p class="text-black dark:text-white text-sm">`+ (source === 'You' ? 'You' : (source === 'Friend' ? 'Friend' : '')) + `</p>
                            <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">`+ content + `</p>
                            </div>
                        `: (type === 'Image' ? `
                        <div class="w-full px-5 py-2 bg-[#222d38] rounded-xl border-l-2 border-white relative flex justify-between">
                                <svg onclick="removeReply()" class="w-7 h-7 hover:rotate-180 duration-300 absolute right-2 shadow-2xl rounded-full cursor-pointer p-2 bg-black fill-white dark:bg-white dark:fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                </svg>
                                <div class="w-full">
                                    <p class="text-black dark:text-white text-sm">`+ (source === 'You' ? 'You' : (source === 'Friend' ? 'Friend' : '')) + `</p>
                                    <p class="text-gray-700 mt-2 dark:text-gray-500 text-xs truncate overflow-hidden">Image</p>
                                </div>
                                <div class="w-fit">
                                    <img class="max-w-28 max-h-20 rounded-md" src="img/chatImage/`+ content + `" alt="">
                                </div>
                            </div>
                        `: ``))}
                    </div>
                    <div class="flex items-center w-full">
                        <div class="flex gap-1 items-center w-fit px-3">
                            <div class="hidden text-gray-600 relative md:flex justify-between items-center min-w-fit select-none px-5 py-3 rounded-lg">
                                <input type="checkbox" name="" id="toggleReplyEmojiSection" class="peer hidden outline-none">
                                <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                <label for="toggleReplyEmojiSection" class="cursor-pointer top-0 left-0 h-full">
                                    <svg class="w-9 h-9 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                    </svg>
                                </label>
                                <div id="replyEmojiContainer" class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-full left-0 w-96 bg-white dark:bg-black shadow-xl bg-opacity-100 rounded-2xl overflow-hidden">

                                </div>
                            </div>
                            <div class="relative">
                                <input type="checkbox" name="" id="toggleReplyImagePreview" class="peer hidden outline-none">
                                <input type="text" class="capitalize pl-3 hidden bg-gray-100 text-base font-medium cursor-pointer" readonly>
                                <label for="toggleReplyImagePreview" class="cursor-pointer top-0 left-0 h-full"></label>
                                <div id="replyImagePreviewContainer" class="absolute z-50 transition-all duration-500 ease-in-out translate-y-10 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible peer-checked:translate-y-1 bottom-full left-0 w-96 h-auto shadow-xl bg-opacity-100 rounded-2xl overflow-hidden flex flex-col justify-between items-end" style="background: rgba(0, 0, 0, 0.4); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); backdrop-filter: blur(4.5px); -webkit-backdrop-filter: blur(4.5px); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.18);">
                                    <button onclick="removeReplyImagePreview()" class="z-10 px-4 py-2 rounded-bl-xl absolute top-0 right-0 bg-white dark:bg-[#101419] shadow-xl">
                                        <svg class="w-4 h-4  fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                        </svg>
                                    </button>
                                    <div class="flex justify-center items-center w-full py-4 max-h-[50vh] relative object-contain overflow-hidden">
                                        <img id="replyImagePreview" class="object-contain w-auto h-full max-h-[inherit]" alt="Preview">
                                    </div>
                                    <div class="bg-white dark:bg-black p-2 w-full flex justify-end">
                                        <button id="sendReplyImageButton" class="z0-10 w-fit text-sm bg-red-500 shadow-2xl rounded-md px-4 py-3 fill-white text-white flex gap-2 items-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">Send
                                            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3.3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <label for="replyImageInput" class="cursor-pointer">
                                    <svg class="w-9 h-9 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
                                    </svg>
                                </label>
                                <input type="file" hidden id="replyImageInput" accept=".jpg, .jpeg, .png">
                            </div>
                        </div>
                        <div class="w-full">
                            <input id="replyMessage" onkeypress="replyMessageInput(event,${messageId})" autofocus class="w-full bg-transparent outline-none border-0 text-black dark:text-white placeholder:text-gray-400 h-12 px-10 py-1" type="text" id="message" placeholder="Type a message">
                        </div>
                        <div id="sendReplyMessage" onclick="sendReplyMessage(${messageId})" class="w-fit px-3">
                            <svg class="w-10 h-10 fill-gray-700 dark:fill-gray-300 p-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                            </svg>
                        </div> 
                    </div>`;


    document.getElementById("sendingMessage").innerHTML = "";
    document.getElementById("sendingMessage").innerHTML = sendMessageWithReplyHtml;
    document.getElementById("allChat").style.paddingBottom = "6rem";
    setTimeout(() => {
        openReplyEmoji();
        replyImageMessage(messageId);

        // Scroll to the bottom
        // allChat.scrollTop = allChat.scrollHeight;
    }, 200);

}

function removeReply() {
    document.getElementById("sendingMessage").innerHTML = "";
    document.getElementById("sendingMessage").innerHTML = sendMessageButtonHtml;

    openEmoji();
    imageMessage();
    document.getElementById("allChat").style.paddingBottom = "1.25rem";
}

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// REPLY MESSAGE END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////









/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// FORWARD MESSAGE START ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////




function messageForward(messageId) {

    if (document.getElementById('toggleChatMenu' + messageId)) {
        if (document.getElementById('toggleChatMenu' + messageId).checked) {
            document.getElementById('toggleChatMenu' + messageId).click()
        }
    }

    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            getAllFriendsDetails: 'getAllFriendsDetails',
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);

            if (data.status === "Success") {

                let allFriendDetails = data.data;

                let friendsData = '';

                allFriendDetails.forEach(friendDetails => {
                    friendsData += `<div onclick="startChat('${friendDetails.user_unique}'), forwardMessage(${friendDetails.user_unique},${messageId})" class="p-2 pr-5 w-full flex items-center justify-between gap-10 hover:scale-105 hover:bg-black duration-300 cursor-pointer">
                        <div class="flex items-center gap-3 w-full p-2">
                            <img class="w-10 h-10 rounded-full" src="img/avatar/${friendDetails.avatar}" alt="">
                            <div class="w-full overflow-hidden">
                                <div class="flex justify-between flex-col gap-1 w-full">
                                    <h3 class="text-gray-800 font-medium capitalize text-sm truncate dark:text-white">${friendDetails.name}</h3>
                                    <p class="text-gray-400 font-medium text-[0.70rem] dark:text-gray-400">${friendDetails.userName}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                });
                const friendListForForwardMessage = document.createElement('div');
                friendListForForwardMessage.classList.add('fixed', 'w-screen', 'h-screen', 'bg-transparent', 'top-0', 'flex', 'justify-center', 'items-center', 'z-50', 'backdrop-blur-none', 'px-2', 'py-5', 'duration-1000', 'opacity-0');
                friendListForForwardMessage.id = 'friendListForForwardMessage';
                friendListForForwardMessage.style.backdropFilter = 'blur(6px)';
                friendListForForwardMessage.style.opacity = '1';



                friendListForForwardMessage.innerHTML = `<ul class="absolute z-50 w-96 max-h-[600px] bg-gray-200 dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden overflow-y-scroll py-2 px-1">
                <div class="flex justify-between items-center pt-2 pb-5 px-5"><p class="text-black dark:text-white">Forward Message</p><svg onclick="removeFriendListForForward()" class="w-9 h-9 p-2 duration-300 hover:rotate-90 rounded-full cursor-pointer shadow-2xl fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></div>
                    ${friendsData}
                </ul>`;

                setTimeout(() => {
                    document.body.appendChild(friendListForForwardMessage);
                }, 300);



            }
        },
    });
}
function removeFriendListForForward() {
    const friendListForForwardMessage = document.getElementById('friendListForForwardMessage');
    document.body.removeChild(friendListForForwardMessage);
}
function forwardMessage(friendUniqueId, messageId) {
    removeFriendListForForward();
    $.ajax({
        type: "POST",
        url: "php/backend-index.php",
        data: {
            forwardMessage: 'forwardMessage',
            user_unique: friendUniqueId,
            messageId: messageId,
        },
        success: function (response) {
            console.log(response);
            const data = JSON.parse(response);
            message.value = "";
            if (data.status === "Success") {
                fetchChat();
            } else if (data.status === "Error") {
                if (data.message === "You are not friends with the target user.") {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are not friends with the target user.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                } else if (data.message === "Target user does not have you as a friend.") {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">Target user does not have you as a friend.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                } else {
                    allChat.innerHTML += `<div class="w-full p-3 mb-10 select-none flex justify-center items-center">
                        <div class="w-1/2 flex items-center justify-center">
                            <p class="rounded-md shadow-2xl py-1 px-4 bg-transparent text-black dark:text-white">You are no longer able to send messages.</p>
                        </div>
                    </div>`;

                    setTimeout(() => {
                        // Scroll to the bottom
                        allChat.scrollTop = allChat.scrollHeight;
                    }, 200);

                }
            } else {
                console.error("Failed to send a new message");
            }
        },
    });
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// FORWARD MESSAGE END /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////





