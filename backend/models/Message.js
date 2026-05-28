import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
{
    sender: {
        type: String,
        required: true,
    },

    senderName: {
        type: String,
        default: "",
    },

    senderImage: {
        type: String,
        default: "",
    },

    receiver: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        default: "",
    },

    attachments: {
        type: Array,
        default: [],
    },

    // ADD THIS
    messageType: {
        type: String,
        default: "text",
    },

    // ADD THIS
    sharedPost: {
        type: Object,
        default: null,
    },

    read: {
        type: Boolean,
        default: false,
    },

    starred: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
);

export default mongoose.model(
    "Message",
    messageSchema
);