export class TestFunction {
  constructor(private form: any, private namespace: string, private parameters: any) {
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
}
