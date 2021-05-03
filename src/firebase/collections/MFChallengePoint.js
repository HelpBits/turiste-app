export class MFChallengePoint {
  constructor(
    name,
    description,
    geometry,
    popularity,
    photo,
    labels,
    checkIns,
    creationDate,
  ) {
    this.name = name;
    this.description = description;
    this.geometry = geometry;
    this.popularity = popularity;
    this.photo = photo;
    this.labels = labels;
    this.checkIns = checkIns;
    this.creationDate = creationDate;
    this.challengeIds = [];
  }
}
