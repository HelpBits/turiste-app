export class MFUser {
    constructor(mail, username, mailValidated, role, visitedChallengePointIds, completedChallengePointIds) {
        this.mail = mail;
        this.username = username;
        this.mailValidated = mailValidated;
        this.role = role;
        this.visitedChallengePointIds = visitedChallengePointIds;
        this.completedChallengePointIds = completedChallengePointIds;
    }
}