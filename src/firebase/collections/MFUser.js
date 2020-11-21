export class MFUser {
    constructor(mail, username, birthdate, mailValidated, role, visitedChallengePointIds, completedChallengePointIds) {
        this.mail = mail;
        this.username = username;
        this.birthdate = birthdate;
        this.mailValidated = mailValidated;
        this.role = role;
        this.visitedChallengePointIds = visitedChallengePointIds;
        this.completedChallengePointIds = completedChallengePointIds;
    }
}