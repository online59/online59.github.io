import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';

class UpdateGroup {
  final GroupRepository repository;

  UpdateGroup(this.repository);

  Future<void> call(Group group) async {
    await repository.updateGroup(group);
  }
}