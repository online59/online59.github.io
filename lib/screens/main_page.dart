import 'package:create_message/constants.dart';
import 'package:create_message/screens/input_message.dart';
import 'package:create_message/screens/message_screen.dart';
import 'package:create_message/widgets/reusable_textfield.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  String? _companyName;
  String? _month;
  String? _type;
  String? _revenueTotal;
  String? _paymentChannel;

  String? _tax1;
  String? _tax3;
  String? _tax53;
  String? _tax54;
  String? _tax30;
  String? _tax36;

  Map<String, String> data = {};

  final _companyNameController = TextEditingController();
  final _monthController = TextEditingController();
  final _typeController = TextEditingController();
  final _revenueTotalController = TextEditingController();
  final _paymentChannelController = TextEditingController();
  final _tax1Controller = TextEditingController();
  final _tax3Controller = TextEditingController();
  final _tax53Controller = TextEditingController();
  final _tax54Controller = TextEditingController();
  final _tax30Controller = TextEditingController();
  final _tax36Controller = TextEditingController();

  void _showSnackBar(String message, Color color) {
    final snackBar = SnackBar(
      content: Text(
        message,
        style: TextStyle(color: color),
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  bool isNull() {
    if (_companyName == null) {
      return true;
    }

    if (_month == null) {
      return true;
    }

    if (_type == null) {
      return true;
    }

    if (_revenueTotal == null) {
      return true;
    }

    if (_paymentChannel == null) {
      return true;
    }

    return false;
  }

  void _showDialog(String errorMessage) {
    final alert = AlertDialog(
      content: Text(
        errorMessage,
        style: const TextStyle(color: Colors.red),
      ),
    );
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }

  void updateData() {
    if (isNull()) {
      _showDialog('อ้วน!! ทำไมไม่กรอกให้ครบทุกช่องล่ะ');
    }

    data = {
      kCompanyName: _companyName!,
      kMonth: _month!,
      kType: _type!,
      kTax1: _tax1 ?? kNotAvailable,
      kTax3: _tax3 ?? kNotAvailable,
      kTax53: _tax53 ?? kNotAvailable,
      kTax54: _tax54 ?? kNotAvailable,
      kTax30: _tax30 ?? kNotAvailable,
      kTax36: _tax36 ?? kNotAvailable,
      kRevenueTotal: _revenueTotal!,
      kPaymentChannel: _paymentChannel!,
    };
  }

  void clearData() {
    data.clear();

    _companyNameController.clear();
    _monthController.clear();
    _typeController.clear();
    _revenueTotalController.clear();
    _paymentChannelController.clear();
    _tax1Controller.clear();
    _tax3Controller.clear();
    _tax53Controller.clear();
    _tax54Controller.clear();
    _tax30Controller.clear();
    _tax36Controller.clear();
  }

  void copyToClipBoard(String text) async {
    try {
      await Clipboard.setData(ClipboardData(text: text));
      _showSnackBar('คัดลอกข้อความแล้ว เอาไปใช้ได้เลยอ้วนน', Colors.green);
    } catch (e) {
      _showSnackBar('คัดลอกไม่ได้ ติดต่อพี่เต้ด่วน', Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('เครื่องมือช่วยคนอ้วน'),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 9,
            child: Row(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Container(
                      padding: const EdgeInsets.all(
                        20.0,
                      ),
                      child: Column(
                        children: [
                          ReusableTextField(
                            title: 'ชื่อบริษัท*',
                            controller: _companyNameController,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _companyName = null;
                              } else {
                                _companyName = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'เดือน*',
                            controller: _monthController,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _month = null;
                              } else {
                                _month = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ประเภท*',
                            controller: _typeController,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _type = null;
                              } else {
                                _type = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.ง.ด.1',
                            controller: _tax1Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax1 = null;
                              } else {
                                _tax1 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.ง.ด.3',
                            controller: _tax3Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax3 = null;
                              } else {
                                _tax3 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.ง.ด.53',
                            controller: _tax53Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax53 = null;
                              } else {
                                _tax53 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.ง.ด.54',
                            controller: _tax54Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax54 = null;
                              } else {
                                _tax54 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.พ.30',
                            controller: _tax30Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax30 = null;
                              } else {
                                _tax30 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ภ.พ.36',
                            controller: _tax36Controller,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _tax36 = null;
                              } else {
                                _tax36 = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'รวมภาษีนำส่ง*',
                            controller: _revenueTotalController,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _revenueTotal = null;
                              } else {
                                _revenueTotal = value;
                              }
                            },
                          ),
                          ReusableTextField(
                            title: 'ช่องทางการจ่ายชำระเงิน*',
                            controller: _paymentChannelController,
                            onChange: (value) {
                              if (value.isEmpty) {
                                _paymentChannel = null;
                              } else {
                                _paymentChannel = value;
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    color: const Color(0xFFE6E6E6),
                    child: data.isEmpty
                        ? const Center(child: Text('ข้อความ'))
                        : SingleChildScrollView(
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: SelectionArea(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('${data['CompanyName']}\n\n'),
                                    Text('MONTH: ${data['Month']}\n'),
                                    Text('TYPE: ${data['Type']}\n\n'),
                                    Text(
                                        'DETAILS: สำหรับรอบเดือน ${data['Month']} ${data['CompanyName']} '),
                                    const Text(
                                      'มียอดที่ต้องชำระดังต่อไปนี้ค่ะ\n\n',
                                    ),
                                    Text(
                                        '1) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.1) จำนวน ${data['Tax1']} บาท\n'),
                                    Text(
                                        '2) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.3) จำนวน ${data['Tax3']} บาท\n'),
                                    Text(
                                        '3) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.53) จำนวน ${data['Tax53']} บาท\n'),
                                    Text(
                                        '4) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.54) จำนวน ${data['Tax54']} บาท\n'),
                                    Text(
                                        '5) ภาษีหัก ณ ที่จ่าย (ภ.พ.36) จำนวน ${data['Tax36']} บาท\n\n'),
                                    Text(
                                        'REVENUE DEPARTMENT: TOTAL ${data['RevenueTotal']} THB\n\n\n'),
                                    Text(
                                        'ช่องทางการจ่ายชำระเงิน: ${data['PaymentChannel']}\n\n\n'),
                                    const Text('ขอบคุณค่ะ'),
                                  ],
                                ),
                              ),
                            ),
                          ),
                  ),
                )
              ],
            ),
          ),
          Expanded(
            flex: 1,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                  ),
                  onPressed: () {
                    setState(() {
                      clearData();
                    });
                  },
                  child: const Text(
                    'ล้างทั้งหมด',
                    style: TextStyle(
                      fontSize: 24.0,
                    ),
                  ),
                ),
                const SizedBox(
                  width: 30.0,
                ),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      updateData();
                    });
                  },
                  child: const Text(
                    'สร้างข้อความ',
                    style: TextStyle(
                      fontSize: 24.0,
                    ),
                  ),
                ),
                const SizedBox(
                  width: 30.0,
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                  ),
                  onPressed: () async{
                    if (isNull()) {
                      _showDialog('อ้วน!! ทำไมไม่กรอกให้ครบทุกช่องล่ะ');
                      return;
                    }
                    
                    String copyText = '${data['CompanyName']}\n\nMONTH: ${data['Month']}\nTYPE: ${data['Type']}\n\nDETAILS: สำหรับรอบเดือน ${data['Month']} ${data['CompanyName']} มียอดที่ต้องชำระดังต่อไปนี้ค่ะ\n\n1) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.1) จำนวน ${data['Tax1']} บาท\n2) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.3) จำนวน ${data['Tax3']} บาท\n3) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.53) จำนวน ${data['Tax53']} บาท\n4) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.54) จำนวน ${data['Tax54']} บาท\n5) ภาษีหัก ณ ที่จ่าย (ภ.พ.36) จำนวน ${data['Tax36']} บาท\n\nREVENUE DEPARTMENT: TOTAL ${data['RevenueTotal']} THB\n\n\nช่องทางการจ่ายชำระเงิน: ${data['PaymentChannel']}\n\n\nขอบคุณค่ะ';
                    await Clipboard.setData(ClipboardData(text: copyText));
                    _showSnackBar('คัดลอกแล้วไออ้วน', Colors.green);
                  },
                  child: const Text(
                    'คัดลอก',
                    style: TextStyle(
                      fontSize: 24.0,
                    ),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
