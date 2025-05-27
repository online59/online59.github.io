import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';

abstract class GroupRepository {
  Future<List<Group>> fetchGroups();
  Future<void> addGroup(Group group);
  Future<void> updateGroup(Group group);
  Future<void> deleteGroup(String id);
}