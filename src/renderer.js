
function getMsgByAvatar(avatarElement) {
    let messageEle = avatarElement.parentElement.parentElement.parentElement.parentElement;
    let messageId = messageEle.id;
    const msgListRef = app.__vue_app__?.config?.globalProperties?.$store?.state?.aio_chatMsgArea.msgListRef.msgs;
    const msg = msgListRef.find(msg => msg.id === messageId)?.data;
    return msg;
}

export function injectPokeMenu() {
    // 可以使用消息id从app.__vue_app__?.config?.globalProperties?.$store?.state?.aio_chatMsgArea获取群号和群成员

    console.log('Inject poke menu...');

    // 选择目标节点
    const targetNode = document.body;
    console.log(targetNode);
    // 配置需要观察的变动类型
    const config = {
        childList: true,      // 观察子节点的变动
        subtree: true         // 观察后代节点
    };

    // 创建一个回调函数，当变动发生时执行
    const callback = function(mutationsList, observer) {
        // console.log(mutationsList);
        for (const mutation of mutationsList) {
            // console.log(mutation.addedNodes);
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const avatars = node.querySelectorAll('.avatar');
                        avatars.forEach(avatar => {
                            console.log(avatar);
                            avatar.addEventListener('contextmenu', e => {
                                // console.log('右击了头像', e);
                                const message = getMsgByAvatar(e.target)
                                if (message.chatType === 1){
                                    window.llqqnt_pp.poke(message.senderUin);
                                }
                            });
                        });
                    }
                    if (node?.previousSibling?.classList?.contains('q-context-menu')){
                        const r = node.previousSibling.getBoundingClientRect();
                        const rightClickEle = document.elementFromPoint(r.x, r.y);
                        // console.log("右击的元素", rightClickEle);
                        if (rightClickEle.classList?.contains('avatar')){
                            node.previousSibling.insertAdjacentHTML('beforeend',
                              '<a class="q-context-menu-item q-context-menu-item-normal poke-menu"><span class="q-context-menu-item__text">戳一戳</span></a>' +
                              '<a class="q-context-menu-item q-context-menu-item-normal special-title-menu"><span class="q-context-menu-item__text">设置头衔</span></a>'
                            );
                            node.previousSibling.querySelector('.poke-menu').addEventListener('click', e=>{
                                const message = getMsgByAvatar(rightClickEle)
                                // const groupName = document.getElementsByClassName("chat-header__contact-name")[0].firstElementChild.textContent.trim();
                                window.llqqnt_pp.poke(message.senderUin, message.peerUin);
                            });

                            node.previousSibling.querySelector('.special-title-menu').addEventListener('click', e=>{
                                const message = getMsgByAvatar(rightClickEle)
                                // const groupName = document.getElementsByClassName("chat-header__contact-name")[0].firstElementChild.textContent.trim();
                                window.llqqnt_pp.setSpecialTitle(message.peerUin, message.senderUid);
                            });

                        }
                    }
                });
            }
        }
    };

    // 创建一个新的观察者实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 开始观察目标节点并传入配置
    observer.observe(targetNode, config);
}

function onLoad() {
    if (location.hash === "#/blank") {
        navigation.addEventListener("navigatesuccess", updateHash, { once: true });
    } else {
        updateHash();
    }

    function updateHash() {
        let hash = location.hash;
        if (hash === "#/blank") {
            return;
        }
        if (hash.includes("#/main/message")) {
            console.log(location);
            injectPokeMenu();
        }

    }
}


onLoad();


export async function onSettingWindowCreated(view) {
    view.innerHTML = `
    <setting-panel>
        <setting-list data-direction="column">
            <setting-item>
                <setting-text>功能：戳一戳、设置群头衔（群主才可用）</setting-text>
            </setting-item>
            <setting-item>
                <setting-text>使用方法：群聊头像右键弹出功能菜单，私聊头像右键戳一戳</setting-text>
            </setting-item>
        </setting-list>
    </setting-panel>
    
    <setting-panel>
        <setting-list data-direction="column">
           <setting-item>
                <setting-text>支持的 Windows QQ 版本：X64 28418 - 29456</setting-text>
            </setting-item>
            <setting-item>
                <setting-text>支持的 Linux QQ 版本：X64/Arm64 28498 - 29456</setting-text>
            </setting-item> 
            <setting-item>
                <setting-text>暂不支持 Mac</setting-text>
            </setting-item> 
            <setting-item>
                <setting-link data-value="https://github.com/NapNeko/LLQQNT-Protocol-Enhance/">当前版本：1.0.3</setting-link>
                <setting-link data-value="https://qm.qq.com/q/fnNSnyClMY">QQ群 545402644</setting-link>
            </setting-item>
        </setting-list>
    </setting-panel>
    `
}