class TestClass():
    def __init__(self):
        self.me = 'Hello!'

    def method1(self,var1):
        self.method2()
        self.me = var1

    def method2(self):
        print('Hello World!')