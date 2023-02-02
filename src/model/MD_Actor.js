import MD_Status from "./MD_Status";

class MD_Actor {
  constructor(status) {
    this.status = MD_Status({ ...status });
  }
}
export default MD_Actor;