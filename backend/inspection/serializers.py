from rest_framework import serializers
from home.models import *


class InspectionTrainEntrySerializer(serializers.ModelSerializer):
    train_id = serializers.IntegerField(source="train.train_id", read_only=True)
    lane_number = serializers.IntegerField(source="lane.bay_number", read_only=True)
    depot_name = serializers.CharField(source="lane.depot.depot_name", read_only=True)

    class Meta:
        model = InspectionBayEntry
        fields = [
            "id",
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


class InspectionBaySerializer(serializers.ModelSerializer):
    depot_name = serializers.CharField(source="depot.depot_name", read_only=True)

    class Meta:
        model = InspectionBay
        fields = ["id", "lane_number", "depot", "depot_name"]


class InspectionBayEntrySerializer(serializers.ModelSerializer):
    lane = serializers.PrimaryKeyRelatedField(queryset=InspectionBay.objects.all())
    train = serializers.PrimaryKeyRelatedField(queryset=Trainset.objects.all())

    # Extra: show human-readable names in response
    lane_name = serializers.CharField(source="lane.depot.depot_name", read_only=True)
    train_display = serializers.SerializerMethodField()

    class Meta:
        model = InspectionBayEntry
        fields = [
            "id",
            "lane",
            "lane_name",
            "train",
            "train_display",
            "scheduledStart",
            "scheduledEnd",
            "enterd",
            "exited",
        ]

    def get_train_display(self, obj):
        return f"Trainset {obj.train.id}"
class JobCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = jobCards
        fields = "__all__"