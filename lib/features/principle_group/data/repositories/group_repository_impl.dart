import 'package:real_estate_helper/features/principle_group/data/datasources/group_remote_datasource.dart';
import 'package:real_estate_helper/features/principle_group/data/models/group_model.dart';
import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';

class GroupRepositoryImpl implements GroupRepository {
  final GroupRemoteDataSource remoteDataSource;

  GroupRepositoryImpl(this.remoteDataSource);

  @override
  Future<void> addGroup(Group group) async {
    await remoteDataSource.addGroup(GroupModel.fromEntity(group));
  }

  @override
  Future<void> deleteGroup(String id) async {
    await remoteDataSource.deleteGroup(id);
  }

  @override
  Future<List<Group>> fetchGroups() async {
    final models = await remoteDataSource.fetchGroups();
    return models.map((model) => model.toEntity()).toList();
  }

  @override
  Future<void> updateGroup(Group group) async {
    await remoteDataSource.updateGroup(GroupModel.fromEntity(group));
  }
}