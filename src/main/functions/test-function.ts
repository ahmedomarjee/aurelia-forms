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
  downloadUrl = "http://www.tip.co.at";
  imageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ec/Blume_mit_Schmetterling_und_Biene_1uf.JPG";
}
