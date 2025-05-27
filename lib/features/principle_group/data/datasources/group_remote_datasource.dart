import 'package:firebase_database/firebase_database.dart';
import 'package:real_estate_helper/features/principle_group/data/models/group_model.dart';

abstract class GroupRemoteDataSource {
  Future<List<GroupModel>> fetchGroups();

  Future<void> addGroup(GroupModel group);

  Future<void> updateGroup(GroupModel group);

  Future<void> deleteGroup(String id);
}

class GroupRemoteDataSourceImpl implements GroupRemoteDataSource {
  final DatabaseReference _groupsRef;

  GroupRemoteDataSourceImpl(this._groupsRef);

  @override
  Future<void> addGroup(GroupModel group) async {
    // Use group.id as the key for the group
    await _groupsRef.child(group.id).set(group.toJson());
  }

  @override
  Future<void> deleteGroup(String id) async {
    await _groupsRef.child(id).remove();
  }

  @override
  Future<List<GroupModel>> fetchGroups() async {
    final snapshot = await _groupsRef.once();
    final data = snapshot.snapshot.value;
    if (data is Map) {
      final groups = data.entries
          .map<GroupModel>((entry) =>
              GroupModel.fromJson(Map<String, dynamic>.from(entry.value)))
          .toList();
      groups.sort((a, b) => a.name.compareTo(b.name));
      return groups;
    }
    return [];
  }

  @override
  Future<void> updateGroup(GroupModel group) async {
    // Update the group with group.id as the key
    await _groupsRef.child(group.id).update(group.toJson());
  }
}
