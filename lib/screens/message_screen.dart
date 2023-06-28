import 'package:flutter/material.dart';

class MessageScreen extends StatelessWidget {
  final Map<String, String> data;

  const MessageScreen({super.key, required this.data});

  @override
  Widget build(BuildContext context) {

    return SingleChildScrollView(
      child: Center(
        child: Container(
          width: 600,
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.max,
            children: [
              SelectableText.rich(
                  TextSpan(
                      style: const TextStyle(
                        backgroundColor: Colors.blue,
                      ),
                      children: [

                        TextSpan(text: '${data['CompanyName']}\n\n'),
                        TextSpan(text: 'MONTH: ${data['Month']}\n'),
                        TextSpan(text: 'TYPE: ${data['Type']}\n\n'),
                        TextSpan(text:
                        'DETAILS: สำหรับรอบเดือน ${data['Month']} ${data['CompanyName']} '),
                        const TextSpan(text: 'มียอดที่ต้องชำระดังต่อไปนี้ค่ะ\n\n', ),
                        TextSpan(text: '1) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.1) จำนวน ${data['Tax1']} บาท\n'),
                        TextSpan(text: '2) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.3) จำนวน ${data['Tax3']} บาท\n'),
                        TextSpan(text: '3) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.53) จำนวน ${data['Tax53']} บาท\n'),
                        TextSpan(text: '4) ภาษีหัก ณ ที่จ่าย (ภ.ง.ด.54) จำนวน ${data['Tax54']} บาท\n'),
                        TextSpan(text: '5) ภาษีหัก ณ ที่จ่าย (ภ.พ.-36) จำนวน ${data['Tax36']} บาท\n\n'),
                        TextSpan(text:
                        'REVENUE DEPARTMENT: TOTAL ${data['RevenueTotal']} THB\n\n\n'),
                        TextSpan(text:
                        'ช่องทางการจ่ายชำระเงิน: ${data['PaymentChannel']}\n\n\n'),
                        const TextSpan(text: 'ขอบคุณค่ะ'),
                      ]
                  )
              )
            ],
          ),
        ),
      ),
    );
  }
}
