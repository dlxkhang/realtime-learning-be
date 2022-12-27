export enum PresentationEvent {
    JOIN_ROOM = 'join-room',
    UPDATE_RESULTS = 'update-results',
    START_PRESENTING = 'start-presenting',
    END_PRESENTING = 'end-presenting',
    NEW_PRESENTING_IN_GROUP = 'new-presenting-in-group',
    PRESENTING_SLIDE_CHANGED = 'presenting-slide-changed',
}

export enum ChatEvent {
    NEW_CHAT_MESSAGE = 'new-chat-message',
}

export enum QnAEvent {
    NEW_QNA_QUESTION = 'new-qna-question',
    UPDATE_QNA_QUESTION = 'update-qna-question',
}
