from rest_framework import serializers
from home.models import *


class ParkingTrainEntrySerializer(serializers.ModelSerializer):
    train_id = serializers.IntegerField(source="train.train_id", read_only=True)
    lane_number = serializers.IntegerField(source="lane.lane_number", read_only=True)
    depot_name = serializers.CharField(source="lane.depot.depot_name", read_only=True)

    class Meta:
        model = ParkingTrainEntry
        fields = [
            "id",
            "train",
            "train_id",
            "lane",
            "lane_number",
            "depot_name",
            "scheduledStart",
            "scheduledEnd",
            "enterd",
            "exited",
        ]
        read_only_fields = ["train_id", "lane_number", "depot_name"]


class ParkingBaySerializer(serializers.ModelSerializer):
    depot_name = serializers.CharField(source="depot.depot_name", read_only=True)

    class Meta:
        model = ParkingBay
        fields = ["id", "lane_number", "depot_name", "depot"]
class TrainsetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainset
        fields = ["id", "train_id", "total_distance_travelled", "distance_travelled_since_last_service"]
        read_only_fields = ["id", "train_id", "total_distance_travelled", "distance_travelled_since_last_service"]

class TrainScheduledSerializer(serializers.ModelSerializer):
    train = TrainsetSerializer()

    class Meta:
        model = TrainScheduled
        fields = ['id', 'train', 'scheduled_date', 'arrival_time', 'departure_time']

    def update(self, instance, validated_data):
        # Extract nested train data
        train_data = validated_data.pop('train', None)

        # Update TrainScheduled fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related Train if train_data is provided
        if train_data:
            train_instance = instance.train
            for attr, value in train_data.items():
                setattr(train_instance, attr, value)
            train_instance.save()

        return instance



class TimetableSerializer(serializers.ModelSerializer):
    train_schedule = TrainScheduledSerializer(source="trainscheduled", read_only=True)

    class Meta:
        model = Timetable
        fields = [
            "id",
            "date",
            "day",
            "train_number",
            "starting_point",
            "starting_time",
            "ending_point",
            "ending_time",
            "train_schedule",
        ]
