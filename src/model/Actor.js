import Status from "./Status";

class Actor {
  constructor(status) {
    this.status = Status({ ...status });
  }
}
export default Actor;