import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';

class GroupModel {
  final String id;
  final String name;

  const GroupModel({required this.id, required this.name});

  factory GroupModel.fromJson(Map<String, dynamic> json) {
    return GroupModel(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
    };
  }

  factory GroupModel.fromEntity(Group group) {
    return GroupModel(id: group.id, name: group.name);
  }

  Group toEntity() {
    return Group(
      id: id,
      name: name,
    );
  }
}
