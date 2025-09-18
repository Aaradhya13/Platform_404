from rest_framework import serializers
from home.models import *


class CleaningTrainEntrySerializer(serializers.ModelSerializer):
    train_id = serializers.IntegerField(source="train.train_id", read_only=True)
    lane_number = serializers.IntegerField(source="lane.bay_number", read_only=True)
    depot_name = serializers.CharField(source="lane.depot.depot_name", read_only=True)

    class Meta:
        model = CleaningTrainEntry
        fields = ["id", "train", "train_id", "lane", "lane_number", "depot_name","scheduledStart", "scheduledEnd", "enterd", "exited"]
        read_only_fields = ["train_id", "lane_number", "depot_name"]


class CleaningBaySerializer(serializers.ModelSerializer):
    depot_name = serializers.CharField(source="depot.depot_name", read_only=True)

    class Meta:
        model = CleaningBay
        fields = ["id", "bay_number", "depot", "depot_name"]

