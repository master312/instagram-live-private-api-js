// Used to handle live broadcast stuff

import State from "../core/state";
const bluebird = require('bluebird');

export default class LiveBroadcastEntity {

    private state: State;

    private broadcastId: string = "";

    public rtmpUrl: string = "";

    public isCreated: boolean = false;

    public isStarted: boolean = false;

    private createRetryCnt: number = 0;

    constructor(state: State) {
        this.state = state;
    }

    /**
     * Create new livestream broadcast, but not start it
     * @param message Message to be shown in notification, but it dose not work for some reason?
     */
    public async create(message = '') {
        console.log("Creating new instagram live broadcast");
        const response = await this.state.request.send({
            url: '/api/v1/live/create/',
            method: 'POST',
            form: this.state.request.sign({
                _csrftoken: this.state.getCookieCsrf(),
                _uuid: this.state.deviceInfo.uuid,
                preview_width: 720,
                preview_height: 1280,
                broadcast_message: message,
                broadcast_type: 'RTMP',
                internal_only: 0
            }),
        });

        let resBody = response.body;
        this.broadcastId = resBody.broadcast_id;
        this.rtmpUrl = resBody.upload_url;

        if (!this.rtmpUrl.includes(this.broadcastId.toString())) {
            // Some times Instagram dose not return same broadcast ID and link ID.
            // This is invalid state. TODO: research why this is happening, and if it can be prevented somehow
            if (this.createRetryCnt < 5) {
                this.createRetryCnt++;
                console.log(`Error. Broadcast ID and link mismatch. Retrying cnt: ${this.createRetryCnt}`);
                console.log(`ID: ${this.broadcastId} LINK: ${this.rtmpUrl}`)
                await bluebird.delay(500);
                await this.create(message);
                return;
            }

            this.createRetryCnt = 0;
            console.log("Failed to create broadcast. Aborting....");
            this.broadcastId = '';
            this.rtmpUrl = '';
            return;
        }

        this.createRetryCnt = 0;
        this.isCreated = true;
        console.log(`Got live broadcast ID: ${this.broadcastId} created.`);
        console.log(`URL: ${this.rtmpUrl} -- ID ${this.broadcastId}`);
    }

    /**
     * Starts an actual broadcast and sent notification to users
     * @param notification if set to TRUE, notification will be sent to followers
     */
    public async start(notification: boolean = false) {
        if (this.isStarted) {
            console.log("Could not start broadcast... Already running");
            return;
        }

        console.log(`Starting broadcast ${this.broadcastId}`);
        const response = await this.state.request.send({
            url: `/api/v1/live/${this.broadcastId}/start/`,
            method: 'POST',
            form: this.state.request.sign({
                _csrftoken: this.state.getCookieCsrf(),
                _uuid: this.state.deviceInfo.uuid,
                should_send_notifications: notification,
                // end_after_copyright_warning TODO?
            }),
        });

        if (response.statusCode != 200) {
            // Failed to start stream
            console.log(`Failed to start broadcast ID: ${this.broadcastId}. Response: ${JSON.stringify(response)}`);
            return;
        }

        this.isStarted = true;
        console.log(`Instagram broadcast ID: ${this.broadcastId} started.`)
    }

    /**
     * Stops stream
     */
    public async stop() {
        if (!this.isStarted) {
            return;
        }

        console.log(`Stopping instagram broadcast ID: ${this.broadcastId}`);
        const response = await this.state.request.send({
            url: `/api/v1/live/${this.broadcastId}/end_broadcast/`,
            method: 'POST',
            form: this.state.request.sign({
                _csrftoken: this.state.getCookieCsrf(),
                _uid: this.state.dsUserId,
                _uuid: this.state.deviceInfo.uuid,
                // end_after_copyright_warning TODO?
            }),
        });

        this.isCreated = false;
        this.isStarted = false;
        this.broadcastId = '';
        this.rtmpUrl = '';
        console.log(`Instagram broadcast ${this.broadcastId} stopped. Status code: ${response.statusCode}`);
    }

    /**
     * Mute comments
     */
    public async mute() {
    }

    /**
     * UnMute comments
     */
    public async unmute() {
    }

    public async getViewerList() {
    }

    public async getLikeCount() {
    }

    public async addPostLiveToIgtv(title: string, description: string, coverUploadId: string, igtvSharePreviewToFeed: boolean = false) {
    }

    public async comment(message: string) {
    }

    public pinComment(commentId: string) {
    }

    public unpinComment(commentId: string) {
    }

    public info() {
    }
}