from .models import Post
from rest_framework import serializers


class PostSerializer(serializers.HyperlinkedModelSerializer):

    author = serializers.HyperlinkedRelatedField(
        many=True
    )

    class Meta:
        model = Post
        fields = ["text", "date_and_time", "likes"]
        # fields = "__all__"

