import 'package:create_message/constants.dart';
import 'package:create_message/screens/message_screen.dart';
import 'package:create_message/widgets/reusable_textfield.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

typedef OnRequest = void Function(Map<String, String>);

class InputMessage extends StatefulWidget {
  final OnRequest onRequest;

  const InputMessage({super.key, required this.onRequest});

  @override
  State<InputMessage> createState() => _InputMessageState();
}

class _InputMessageState extends State<InputMessage> {
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

  late Map<String, String>? data;

  final controller = TextEditingController();

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

  void _showSnackbar(String errorMessage) {
    final snackBar = SnackBar(
      content: Text(
        errorMessage,
        style: const TextStyle(color: Colors.red),
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ReusableTextField(
                title: 'ชื่อบริษัท',
                onChange: (value) {
                  _companyName = value;
                },
              ),
              ReusableTextField(
                title: 'เดือน',
                onChange: (value) {
                  _month = value;
                },
              ),
              ReusableTextField(
                title: 'ประเภท',
                onChange: (value) {
                  _type = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.ง.ด.1',
                onChange: (value) {
                  _tax1 = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.ง.ด.3',
                onChange: (value) {
                  _tax3 = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.ง.ด.53',
                onChange: (value) {
                  _tax53 = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.ง.ด.54',
                onChange: (value) {
                  _tax54 = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.พ.30',
                onChange: (value) {
                  _tax30 = value;
                },
              ),
              ReusableTextField(
                title: 'ภ.พ.36',
                onChange: (value) {
                  _tax36 = value;
                },
              ),
              ReusableTextField(
                title: 'รวมภาษีนำส่ง',
                onChange: (value) {
                  _revenueTotal = value;
                },
              ),
              ReusableTextField(
                title: 'ช่องทางการจ่ายชำระเงิน',
                onChange: (value) {
                  _paymentChannel = value;
                },
              ),
              const SizedBox(
                height: 20.0,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: () {
                      controller.clear();
                    },
                    child: const Text(
                      'ลบทั้งหมด',
                      style: TextStyle(
                        fontSize: 20,
                        color: Colors.red,
                      ),
                    ),
                  ),
                  const SizedBox(width: 40,),
                  TextButton(
                    onPressed: () {
                      if (isNull()) {
                        _showSnackbar('อ้วน!! ทำไมไม่กรอกให้ครบทุกช่องล่ะ');
                        return;
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

                      widget.onRequest(data!);
                    },
                    child: const Text(
                      'สร้างข้อความ',
                      style: TextStyle(
                        fontSize: 20,
                      ),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
