import LoopState from "../../States/AudioStates/LoopState.js";
import MsgState from "../../States/AudioStates/MsgState.js";
import ShuffleState from "../../States/AudioStates/ShuffleState.js";
import SubscriptionState from "../../States/AudioStates/SubscriptionState.js";
import VConnectionState from "../../States/VoiceStates/VConnectionState.js";
import VoiceState from "../../States/VoiceStates/VoiceState.js";
import Queues from "../../utils/ForAudio/Queue.js";
import VoiceConnectorX from "../../utils/ForVoice/VoiceConnector.js";

const VoiceConnector = new VoiceConnectorX();

const Disconnect = async (msg) => {
    if (!VoiceState.getVoiceChannel) {
        msg.reply('You are not in Voice');
        return;
    }
    if (!VConnectionState.getVConnection && (VoiceState.getVoiceChannel.id != VoiceState.getClientVoiceId)) {
        msg.reply('You are not in Same Voice Channel');
        return;
    }
    const noConnect = VoiceConnector.disconnect(VConnectionState.getVConnection);
    if (noConnect) {
        if (SubscriptionState.getSubscription) {
            SubscriptionState.getSubscription.unsubscribe();
        }
        Queues.clearQueue();
        VConnectionState.setVConnection = null;
        try {
            if (await MsgState.getPrevPlayMsg) {
                await MsgState.getPrevPlayMsg.delete();
            }
        } catch (error) {
            console.log('[Debug] No Prev Play Msg');
        }
        if (MsgState.getPrevQMsg) {
            MsgState.getPrevQMsg.edit({ components: [] });
        }
        ShuffleState.setisShuffleOff = false;
        ShuffleState.setisShuffleOn = false;
        ShuffleState.setonShuffle = false;
        LoopState.setLoopAllQueue = false;
        LoopState.setLooping = false;
        msg.reply('Voice Disconnected');
    }
}

export default Disconnect