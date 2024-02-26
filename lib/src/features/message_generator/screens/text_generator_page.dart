import 'package:create_message/src/features/message_generator/constants/constants.dart';
import 'package:create_message/src/features/message_generator/data/tax_data.dart';
import 'package:create_message/src/features/message_generator/widgets/reusable_textfield.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class TextGeneratorPage extends StatefulWidget {
  const TextGeneratorPage({Key? key}) : super(key: key);

  @override
  State<TextGeneratorPage> createState() => _TextGeneratorPageState();
}

class _TextGeneratorPageState extends State<TextGeneratorPage> {
  String outputMessage = '';

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

  Map<String, String> companyData = {};
  Map<String, String> taxData = {};

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

    companyData = {
      kCompanyName: _companyName!,
      kMonth: _month!,
      kType: _type!,
      kRevenueTotal: _revenueTotal!,
      kPaymentChannel: _paymentChannel!,
    };

    taxData = {
      kTax1: _tax1 ?? kNotAvailable,
      kTax3: _tax3 ?? kNotAvailable,
      kTax53: _tax53 ?? kNotAvailable,
      kTax54: _tax54 ?? kNotAvailable,
      kTax30: _tax30 ?? kNotAvailable,
      kTax36: _tax36 ?? kNotAvailable,
    };
  }

  void clearData() {
    companyData.clear();

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
                            maxLine: 8,
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
                    child: companyData.isEmpty
                        ? const Center(child: Text('ข้อความ'))
                        : SingleChildScrollView(
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: SelectionArea(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    generateMessage(),
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
                  onPressed: () async {
                    if (isNull()) {
                      _showDialog('อ้วน!! ทำไมไม่กรอกให้ครบทุกช่องล่ะ');
                      return;
                    }
                    await Clipboard.setData(ClipboardData(text: outputMessage));
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

  Text generateMessage() {
    List<String> header = [
      '${companyData['CompanyName']}\n\nMONTH: ${companyData['Month']}\n',
      'TYPE: ${companyData['Type']}\n\n',
      'DETAILS: สำหรับรอบเดือน ${companyData['Month']} ${companyData['CompanyName']} มียอดที่ต้องชำระดังต่อไปนี้ค่ะ\n\n',
    ];

    List<String> taxMessages = [];
    int index = 1;
    for (String taxKey in taxData.keys) {
      if (taxData[taxKey] != '0') {
        taxMessages.add(
            '$index) ภาษีหัก ณ ที่จ่าย (${taxInfo[taxKey]}) จำนวน ${taxData[taxKey]} บาท\n');
        index += 1;
      }
    }

    List<String> footer = [
      '\n',
      'REVENUE DEPARTMENT: TOTAL ${companyData['RevenueTotal']} THB\n\n\n',
      'ช่องทางการจ่ายชำระเงิน: ${companyData['PaymentChannel']}\n\n\n',
      'ขอบคุณค่ะ',
    ];

    if (taxMessages.isNotEmpty) {
      header.addAll(taxMessages);
    }

    header.addAll(footer);

    outputMessage = header.join();

    return Text(outputMessage);
  }
}