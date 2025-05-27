import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ChecklistPage extends StatefulWidget {
  const ChecklistPage({super.key});

  @override
  State<ChecklistPage> createState() => _ChecklistPageState();
}

class _ChecklistPageState extends State<ChecklistPage> {
  final List<Map<String, dynamic>> checklistItems = [
    {'title': 'ทั่วไป', 'checked': false, 'header':true},
    {'title': 'กฎหลักของการลงทุนอสังหาคือคน คนในพื้นที่นั้นเป็นประเภทไหน คนจะเป็นตัวกำหนดการลงทุนในพื้นที่นั้น เช่น ในพื้นที่มีคนระดับกลาง จะไปลงทุนคอนโด High-end ก็จะเจ๊ง ดังนั้นคนในพื้นที่นั้นเป็นแบบไหน แบ่งระดับเป็นอย่างไร', 'checked': false},
    {'title': 'กลุ่มลูกค้าหลักคือใคร ใครจะมาเช่าเรา รู้จักลูกค้าดีพอหรือไม่', 'checked': false},
    {'title': 'หนึงกลุ่มลูกค้า หนึ่งตลาด หนึ่งทำเล ในพื้นที่นี้ใครคือกลุ่มลูกค้า ตลาดอะไร ทำเลเป็นแบบไหน', 'checked': false},
    {'title': 'รายได้กลุ่มลูกค้าหลักเท่าไหร่', 'checked': false},
    {'title': 'พฤษติกรรมคนในพื้นที่นั้น', 'checked': false, 'header':true},
    {'title': 'การทำงาน', 'checked': false},
    {'title': 'การกินอยู่', 'checked': false},
    {'title': 'การเดินทาง/จราจร', 'checked': false},
    {'title': 'การออกกำลังกาย', 'checked': false},
    {'title': 'การเข้าสังคม', 'checked': false},
    {'title': 'การดูแลสุขภาพ', 'checked': false},
    {'title': 'พื้นที่ลงทุนในบริเวณนั้นมีผลตอบแทนมากกว่าเงินผ่อนต่องวด (อัตราอยู่ที่ 6000 บาท/เงินกู้ 1 ล้าน)', 'checked': false},
    {'title': 'ความต้องการเช่า', 'checked': false, 'header':true},
    {'title': 'แหล่งงานในระยะ 2-3 กิโลเมตรคืออะไร เป็นอะไรบ้างมีจำนวนมากน้อยอย่างไร', 'checked': false},
    {'title': 'ใกล้นิคม แหล่งพาณิชย์ ออฟฟิศ สำนักงาน', 'checked': false},
    {'title': 'ความหนาแน่นของแหล่งงาน', 'checked': false},
    {'title': 'เป็นแหล่งมีคนหนาแน่น', 'checked': false},
    {'title': 'มีการจราจรติดขัดช่วง 7-9 น. และ 16-20 น.', 'checked': false},
    {'title': 'ร้านอาหารไม่อร่อยแต่ขายดี', 'checked': false},
    {'title': 'รายได้เฉลี่ยของผู้เช่าในระยะ 2-3 กิโลเมตรอยู่ในเกณฑ์กลุ่มเป้าหมาย', 'checked': false},
    {'title': 'อัตราการเช่า/เข้าพักคอนโดของเราเกิน 90%', 'checked': false},
    {'title': 'อัตราการเช่าตึกโดยรอบที่มีค่าเช่าเท่ากันหรือมากกว่ามีเกิน 90%', 'checked': false},
    {'title': 'ข้อมูลจากแม่ค้าแถวนั้น', 'checked': false},
    {'title': 'ข้อมูลจากวินมอเตอร์ไซค์', 'checked': false},
    {'title': 'เดินดูหลังบ้าน มีเสื้อผ้าตากอยู่กี่ห้อง', 'checked': false},
    {'title': 'ลงพื้นที่ตอนกลางคืน นับจำนวนห้องที่เปิด/ปิดไฟ', 'checked': false},
    {'title': 'คู่แข่งน้อย จำนวนคอนโด Sector เดียวกันมีน้อย', 'checked': false},
    {'title': 'พื้นที่ว่างพอที่จะสร้างคอนโดใหม่ใน Sector เดียวกันเพิ่มได้', 'checked': false},
    {'title': 'พื้นที่โดนรอบเป็นพื้นที่มีมูลค่า ไม่ใช่สลัม ฯลฯ', 'checked': false},
    {'title': 'มูลค่าพื้นที่มีโอกาสเติบโตในอนาคต', 'checked': false},
    {'title': 'อัตราค่าเช่าตึกของเราเท่ากับหรือใกล้เคียงตึกรอบข้างที่มีห้องแบบเดียวกัน ส่วนกลางแบบเดียวกัน', 'checked': false},
    {'title': 'บริเวณโดยรอบไม่มีพื้นที่ว่างที่จะสร้างคอนโดใหม่ขึ้นมา Supply ได้', 'checked': false},
    {'title': 'ในพื้นที่มีการขยายตัวของแหล่งงาน', 'checked': false},
    {'title': 'สิ่งอำนวยความสะดวก', 'checked': false, 'header': true},
    {'title': 'อยู่ใกล้กับห้างฯ ในระยะ 2-3 กิโลเมตร', 'checked': false},
    {'title': 'อยู่ใกล้กับร้านอาหาร ในระยะ 2-3 กิโลเมตร', 'checked': false},
    {'title': 'มีร้านอาหารหนาแน่น', 'checked': false},
    {'title': 'เป็นแหล่งคึกคักยามค่ำคืน', 'checked': false},
    {'title': 'อยู่ใกล้กับ 7-eleven ในระยะ 200 เมตร', 'checked': false},
    {'title': 'มีระยะทางเดินไปยังสถานีรถไฟฟ้าไม่เกิน 200 เมตร (หากเกินทางเดินต้องร่มรื่นและไม่เกิน 500 เมตร)', 'checked': false},
    {'title': 'ที่จอดรถเพียงพอ มากกว่า 50% ของยูนิต', 'checked': false},
    {'title': 'ความสะอาด', 'checked': false, 'header': true},
    {'title': 'ทางเดิน', 'checked': false},
    {'title': 'การจัดการขยะ', 'checked': false},
    {'title': 'การกำจัดกลิ่น', 'checked': false},
    {'title': 'การบำบัดน้ำเสีย', 'checked': false},
    {'title': 'มลภาวะรบกวน', 'checked': false, 'header': true},
    {'title': 'เสียงดัง เป็นพื้นที่จัดกิจกรรม งานเทศการ เสียงห้องเครื่อง ลิฟต์ เสียงจากผู้คน ฯลฯ', 'checked': false},
    {'title': 'แสง แดดส่อง แสงไฟจากสนามกีฬา ไฟรถยนต์ ฯลฯ', 'checked': false},
    {'title': 'ฝุ่น จากการก่อสร้าง จากพื้นที่รถร้าง', 'checked': false},
    {'title': 'ความสั่นสะเทือน จากรถบรรทุกวิ่ง การก่อสร้าง ฯลฯ', 'checked': false},
    {'title': 'ความเหมาะสมของห้อง', 'checked': false, 'header': true},
    {'title': 'เป็นขนาดห้องที่ปล่อยเช่าง่ายที่สุด', 'checked': false},
    {'title': 'ไม่อยู่ใกล้กับลิฟต์', 'checked': false},
    {'title': 'ไม่อยู่ใกล้ห้องขยะ', 'checked': false},
    {'title': 'ไม่อยู่ใกล้กับห้องระบบไฟ', 'checked': false},
    {'title': 'ไม่อยู่ใกล้กับทางหนีไฟ', 'checked': false},
    {'title': 'ไม่อยู่ใกล้กับบันได', 'checked': false},
    {'title': 'ไม่อยู่ในทางสามแพร่ง', 'checked': false},
    {'title': 'ไม่อยู่ใกล้ห้องเครื่อง', 'checked': false},
    {'title': 'ไม่อยู่ใกล้สระว่ายน้ำ', 'checked': false},
    {'title': 'ไม่อยู่ใกล้ห้องจัดเลี้ยง', 'checked': false},
    {'title': 'ไม่อยู่ใกล้ Co-Working Space', 'checked': false},
    {'title': 'ทิศของห้องอยู่ทิศเหนือ', 'checked': false},
    {'title': 'ทิศห้องมีลมพัดเข้า ไม่มีตึกบังทิศลมพัด', 'checked': false},
    {'title': 'มีช่องระบายอากาศหน้าห้อง', 'checked': false},
    {'title': 'เป็นห้องมุม', 'checked': false},
    {'title': 'เป็นห้องในชั้นสูง มากกว่าชั้น 15', 'checked': false},
    {'title': 'ผลรวมเลขห้องเป็นเลขมงคล ผลรวมไม่ได้เลข 2/3/7', 'checked': false},
    {'title': 'วิวไม่บดบัง มองเห็นเมือง หรือแม่น้ำ', 'checked': false},
    {'title': 'ประตูห้องไม่เปิดตรงชนกัน อยู่เยื้องกัน', 'checked': false},
    {'title': 'มีระเบียงห้องสำหรับตากผ้า', 'checked': false},
    {'title': 'มีการแบ่งโซนห้องครัวและมีผนังกั้น', 'checked': false},
    {'title': 'ห้องน้ำแบ่งโซนแห้งและเปียก', 'checked': false},
    {'title': 'ไม่มีพื้นที่ซอกลับเล็กๆ ในห้อง', 'checked': false},
    {'title': 'หัวเตียงไม่หันไปในทิศห้องครัว/ห้องน้ำ', 'checked': false},
    {'title': 'มีตู้เสื้อผ้าขนาดเหมาะสม', 'checked': false},
    {'title': 'มีตู้เก็บของเพียงพอ', 'checked': false},
    {'title': 'การออกแบบตกแต่งห้องเหมาะสมกับกลุ่มลูกค้าเป้าหมาย', 'checked': false},
    {'title': 'เครื่องใช้ไฟฟ้า', 'checked': false, 'header': true},
    {'title': 'แอร์', 'checked': false},
    {'title': 'ทีวี', 'checked': false},
    {'title': 'ตู้เย็น', 'checked': false},
    {'title': 'ไม่โครเวฟ', 'checked': false},
    {'title': 'เครื่องทำน้ำอุ่น', 'checked': false},
    {'title': 'สัญญาณไฟไหม้', 'checked': false},
    {'title': 'เครื่องครัว', 'checked': false, 'header': true},
    {'title': 'ปล่องดูควัน', 'checked': false},
    {'title': 'เตาไฟฟ้า', 'checked': false},
    {'title': 'ตู้เก็บของ', 'checked': false},
    {'title': 'อ่างล้างจาน', 'checked': false},
    {'title': 'นิติและสาธารณูปโภค', 'checked': false, 'header': true},
    {'title': 'นิติเป็นใคร', 'checked': false},
    {'title': 'นิติมีประวัติที่ดีไหม', 'checked': false},
    {'title': 'ค่าน้ำมีส่วนเพิ่มไหม', 'checked': false},
    {'title': 'ค่าไฟฟ้ามีส่วนเพิ่มไหม', 'checked': false},
    {'title': 'ค่าส่วนกลางแพงไหม', 'checked': false},
    {'title': 'อัตราดอกเบี้ยและค่างวด', 'checked': false, 'header': true},
    {'title': 'รายได้จากค่าเช่า', 'checked': false},
    {'title': 'ค่าใช้จ่ายต่อเดือน (รวมส่วนกลาง ฯลฯ)', 'checked': false},
    {'title': 'กำไรต่อปี', 'checked': false},
    {'title': 'ราคาซื้อต่ำกว่า (ค่าเช่า x 12) / MRR + 2%', 'checked': false},
    {'title': 'อัตราผลตอบแทน Net Profit (หักค่าเช่าแล้ว) มากกว่า MRR + 2% ของเงินกู้ทั้งหมด', 'checked': false},
    {'title': 'กลยุทธ์', 'checked': false, 'header': true},
    {'title': 'กระแสเงินสดเป็นบวกตั้งแต่วันแรก', 'checked': false},
    {'title': 'ลงทุนให้ได้ผลตอบแทนสูงก็หมายถึงเราต้องซื้อถูก', 'checked': false},
    {'title': 'ระหว่างถือครองพยายามลดอัตราดอกเบี้ยลงโดยการ Refiance และการโปะเงินส่วนต่าง (โปะอย่างน้อย 10%) ต่อเดือน', 'checked': false},
    {'title': 'ความเสี่ยงสูงสุดคือการไม่มีผู้เช่า ดังนั้นต้องมีเงินสำรองเผื่อฉุกเฉินอย่างน้อย 3 เดือน', 'checked': false},
    {'title': 'ค้นหาหรือต่อรองให้ได้ราคาที่ต่ำที่สุด', 'checked': false},
    {'title': 'เลือกอัตราดอกเบี้ยต่ำสุด เงื่อนไขดีสุด', 'checked': false},
    {'title': 'ลงทุนในย่านที่มีการเติบโตของแหล่งงาน', 'checked': false},
    {'title': 'กฎหลักของการลงทุนอสังหาคือคน คนเป็นประเภทไหน คนจะเป็นตัวกำหนดการลงทุนในพื้นที่นั้น เช่น ในพื้นที่มีคนระดับกลาง จะไปลงทุนคอนโด High-end ก็จะเจ๊ง', 'checked': false},
    {'title': 'จัดสัดส่วนเงินดาวน์บ้านและระยะเวลาผ่อนให้เหมาะสม', 'checked': false},
  ];

  @override
  void initState() {
    super.initState();
    for (var item in checklistItems) {
      item['controller'] = TextEditingController();
    }
  }

  @override
  void dispose() {
    for (var item in checklistItems) {
      item['controller'].dispose();
    }
    super.dispose();
  }


  Future<void> _saveChecklist() async {
    final csvData = _generateCSV();
    final response = await http.post(
      Uri.parse('https://api.github.com/repos/your-username/your-repo/dispatches'),
      headers: {
        // 'Authorization': 'token ${dotenv.env['GITHUB_TOKEN']}',
        'Authorization': 'token',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'event_type': 'upload_csv',
        'client_payload': {'csv_content': csvData},
      }),
    );

    if (response.statusCode == 204) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Checklist saved successfully!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to save checklist.')),
      );
    }
  }

  String _generateCSV() {
    final headers = ['Title', 'Checked', 'Note'];
    final rows = checklistItems.map((item) {
      return '${item['title']},${item['checked']},${item['controller'].text}';
    }).toList();

    return [headers.join(','), ...rows].join('\n');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checklist'),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveChecklist,
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: checklistItems.length,
        itemBuilder: (context, index) {
          final item = checklistItems[index];
          if (item['header'] == true) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              child: Text(
                item['title'],
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            );
          } else {
            return Card(
              margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  children: [
                    CheckboxListTile(
                      title: Text(item['title']),
                      value: item['checked'],
                      onChanged: (bool? value) {
                        setState(() {
                          item['checked'] = value!;
                        });
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: TextField(
                        controller: item['controller'],
                        decoration: const InputDecoration(labelText: 'Note'),
                        onChanged: (text) {
                          setState(() {
                            item['note'] = text;
                          });
                        },
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
        },
      ),
    );
  }
}