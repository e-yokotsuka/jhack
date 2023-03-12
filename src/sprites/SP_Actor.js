class SP_Actor {
  constructor(core,status){
    this.core = core;
    this.status = status;
  }

  healHp(){
    console.warn('healHp')
  }

  itemUsed(){
    console.warn('itemUsed')   
  }

  addText = text=>{
    const { core: { addText } } = this;
    addText(text);
  }

}

export default SP_Actor;


