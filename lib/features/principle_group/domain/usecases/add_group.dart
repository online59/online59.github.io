import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/domain/repositories/group_repository.dart';

class AddGroup {
  final GroupRepository repository;

  AddGroup(this.repository);

  Future<void> call(Group group) async {
    await repository.addGroup(group);
  }
}