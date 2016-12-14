import {FormBase} from "../../framework/base/form-base";

export class TestFunction {
  constructor(private form: FormBase, private namespace: string, private parameters: any) {
      
  }
  dummyRowClickFunc(e){
      alert("rowClick Data: " +  e.data.a);
  }
  dataList = [
      {
          a: "A",
          b: "B"
      },
      {
          a: "A",
          b: "B"
      },
      {
          a: "A",
          b: "B"
      }
  ];

  dummyText = {
      placeholder: "This is a dummy"
  }

  giveItToMe = {
      id: "giveItToMe",
      title: "Test with Func",
      execute: () => {
          alert('Hallo');
      }
  }
  icon = "fa-book";
}
